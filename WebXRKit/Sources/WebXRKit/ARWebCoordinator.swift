import ARKit
import Foundation
import SceneKit
import WebKit

@MainActor
public class ARWebCoordinator: NSObject, WKNavigationDelegate, ARSessionDelegate,
    WKScriptMessageHandler
{
    weak var webView: WKWebView?
    weak var arView: ARSCNView?
    var dataCallbackName: String?
    var isSessionRunning = false

    var isCameraAccessRequested = false

    public var onSessionActiveChanged: ((Bool) -> Void)?
    public var onNavigationChanged: (() -> Void)?

    private let cameraProcessor = ARCameraFrameProcessor()

    private var isJsProcessingFrame = false

    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        onNavigationChanged?()
    }

    public func webView(
        _ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error
    ) {
        onNavigationChanged?()
    }

    public func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        onNavigationChanged?()
    }

    public func userContentController(
        _ userContentController: WKUserContentController, didReceive message: WKScriptMessage
    ) {
        guard let body = message.body as? [String: Any] else { return }

        if let errorMsg = body["error_message"] as? String {
            print("JS Error: \(errorMsg)")
            return
        }

        switch message.name {
        case "initAR":
            if let callback = body["callback"] as? String {
                replyToJS(callback: callback, data: "ios-ar-device-id")
            }
        case "requestSession":
            if let options = body["options"] as? [String: Any],
                let callbackName = body["data_callback"] as? String
            {
                self.dataCallbackName = callbackName

                self.isCameraAccessRequested = options["computer_vision_data"] as? Bool ?? false

                self.startARSession(options: options)
                self.onSessionActiveChanged?(true)

                if let responseCallback = body["callback"] as? String {
                    replyToJS(
                        callback: responseCallback,
                        data: [
                            "cameraAccess": self.isCameraAccessRequested,
                            "worldAccess": true,
                            "webXRAccess": true,
                        ]
                    )
                }
            }
        case "stopAR":
            self.stopSession(notifyJS: false)

        case "hitTest":
            if let x = body["x"] as? Double,
                let y = body["y"] as? Double,
                let callback = body["callback"] as? String
            {
                self.performHitTest(x: x, y: y, callback: callback)
            }

        default: break
        }
    }

    public func startARSession(options: [String: Any]) {
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal, .vertical]
        // Enable auto-focus if available
        if let currentDevice = ARWorldTrackingConfiguration.supportedVideoFormats.first {
            config.videoFormat = currentDevice
        }
        arView?.session.run(config, options: [.resetTracking, .removeExistingAnchors])

        // Match WebXR's y=0 at device floor level
        var translation = matrix_identity_float4x4
        translation.columns.3.y = -1.6

        arView?.session.setWorldOrigin(relativeTransform: translation)
        isSessionRunning = true
    }

    public func stopSession(notifyJS: Bool = true) {
        guard isSessionRunning else { return }
        isSessionRunning = false
        isCameraAccessRequested = false
        arView?.session.pause()
        self.onSessionActiveChanged?(false)
        print("AR Session stopped.")
        if notifyJS {
            webView?.reload()
        }
    }

    func performHitTest(x: Double, y: Double, callback: String) {
        guard let arView = arView else { return }

        let point = CGPoint(
            x: CGFloat(x) * arView.bounds.width,
            y: CGFloat(y) * arView.bounds.height
        )

        // 1. Raycast against existing planes (Geometry)
        var results: [ARRaycastResult] = []

        if let query = arView.raycastQuery(
            from: point, allowing: .existingPlaneGeometry, alignment: .any)
        {
            results = arView.session.raycast(query)
        }

        // 2. If no geometry, raycast against estimated planes
        if results.isEmpty {
            if let query = arView.raycastQuery(
                from: point, allowing: .estimatedPlane, alignment: .any)
            {
                results = arView.session.raycast(query)
            }
        }

        var hitsPayload: [[String: Any]] = []

        for result in results {
            let tf = result.worldTransform
            var hitData: [String: Any] = [
                "world_transform": toArray(tf)
            ]

            if let anchor = result.anchor {
                hitData["uuid"] = anchor.identifier.uuidString
            }

            hitsPayload.append(hitData)
        }

        replyToJS(callback: callback, data: hitsPayload)
    }

    nonisolated public func session(_ session: ARSession, didUpdate frame: ARFrame) {
        MainActor.assumeIsolated { [weak self] in
            guard let self = self else { return }
            guard isSessionRunning,
                !isJsProcessingFrame,
                let webView = self.webView,
                let callbackName = self.dataCallbackName
            else { return }

            isJsProcessingFrame = true

            let orientation = UIInterfaceOrientation.portrait
            let viewportSize = webView.bounds.size

            // 1. Calculate Matrices
            let viewMatrix = frame.camera.viewMatrix(for: orientation)
            let cameraTransform = viewMatrix.inverse
            let projMatrix = frame.camera.projectionMatrix(
                for: orientation,
                viewportSize: viewportSize,
                zNear: 0.01,
                zFar: 1000
            )

            // 2. Build JS Command
            var jsCommand = "if(!window.NativeARData){window.NativeARData={};}"
            jsCommand += "window.NativeARData.timestamp = \(frame.timestamp * 1000);"
            jsCommand +=
                "window.NativeARData.light_intensity = \(frame.lightEstimate?.ambientIntensity ?? 1000);"
            jsCommand +=
                "window.NativeARData.camera_transform = \(fastFloatArrayToString(cameraTransform));"
            jsCommand += "window.NativeARData.camera_view = \(fastFloatArrayToString(viewMatrix));"
            jsCommand +=
                "window.NativeARData.projection_camera = \(fastFloatArrayToString(projMatrix));"

            // 3. Video Processing (if requested)
            let conversionResult = cameraProcessor.process(
                frame: frame,
                viewportSize: viewportSize,
                isCameraAccessRequested: isCameraAccessRequested
            )

            if let result = conversionResult {
                jsCommand += "window.NativeARData.video_data = '\(result.base64)';"
                jsCommand += "window.NativeARData.video_width = \(result.width);"
                jsCommand += "window.NativeARData.video_height = \(result.height);"
                jsCommand += "window.NativeARData.video_updated = true;"
            } else {
                jsCommand += "window.NativeARData.video_updated = false;"
            }

            jsCommand += "\(callbackName)();"

            webView.evaluateJavaScript(jsCommand) { [weak self] _, _ in
                Task { @MainActor in
                    self?.isJsProcessingFrame = false
                }
            }
        }
    }

    private func toArray(_ m: simd_float4x4) -> [Float] {
        return [
            m.columns.0.x, m.columns.0.y, m.columns.0.z, m.columns.0.w,
            m.columns.1.x, m.columns.1.y, m.columns.1.z, m.columns.1.w,
            m.columns.2.x, m.columns.2.y, m.columns.2.z, m.columns.2.w,
            m.columns.3.x, m.columns.3.y, m.columns.3.z, m.columns.3.w,
        ]
    }

    private func replyToJS(callback: String, data: Any) {
        guard let webView = webView else { return }

        if let str = data as? String {
            webView.evaluateJavaScript("\(callback)('\(str)')")
        } else if let jsonData = try? JSONSerialization.data(withJSONObject: data),
            let jsonString = String(data: jsonData, encoding: .utf8)
        {
            webView.evaluateJavaScript("\(callback)(\(jsonString))")
        } else {
            webView.evaluateJavaScript("\(callback)(null)")
        }
    }

    private func fastFloatArrayToString(_ m: simd_float4x4) -> String {
        return "[\(m.columns.0.x),\(m.columns.0.y),\(m.columns.0.z),\(m.columns.0.w),"
            + "\(m.columns.1.x),\(m.columns.1.y),\(m.columns.1.z),\(m.columns.1.w),"
            + "\(m.columns.2.x),\(m.columns.2.y),\(m.columns.2.z),\(m.columns.2.w),"
            + "\(m.columns.3.x),\(m.columns.3.y),\(m.columns.3.z),\(m.columns.3.w)]"
    }
}
