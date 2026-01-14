import Foundation
import ARKit
import SceneKit
import WebKit

@MainActor
class ARWebCoordinator: NSObject, WKNavigationDelegate, ARSessionDelegate, WKScriptMessageHandler {
    weak var webView: WKWebView?
    weak var arView: ARSCNView?
    var isSessionRunning = false

    var onSessionActiveChanged: ((Bool) -> Void)?
    var onNavigationChanged: (() -> Void)?

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        onNavigationChanged?()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        onNavigationChanged?()
    }
    
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        onNavigationChanged?()
    }

    // --- AR / Image Processing Properties ---
    let ciContext = CIContext(options: [.useSoftwareRenderer: false])
    let sRGBColorSpace = CGColorSpace(name: CGColorSpace.sRGB)!

    // Performance Control
    var frameCounter = 0
    let videoFrameSkip = 6
    let maxVideoDimension: CGFloat = 480.0
    
    // --- WKScriptMessageHandler ---
    
    func userContentController(
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
            let options = body["options"] as? [String: Any] ?? [:]
            self.startARSession(options: options)
            self.onSessionActiveChanged?(true)
            
            if let callback = body["callback"] as? String {
                replyToJS(callback: callback, data: "session-started")
            }
            
        case "stopAR":
            self.stopSession(notifyJS: false)
            
        case "hitTest":
            if let x = body["x"] as? Double,
               let y = body["y"] as? Double,
               let callback = body["callback"] as? String {
                self.performHitTest(x: x, y: y, callback: callback)
            }
            
        default: break
        }
    }

    func startARSession(options: [String: Any]) {
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal, .vertical]
        // Ensure gravity alignment so y=0 is consistent with WebXR expectations
        config.worldAlignment = .gravity
        arView?.session.run(config, options: [.resetTracking, .removeExistingAnchors])
        isSessionRunning = true
    }
    
    func stopSession(notifyJS: Bool = true) {
        guard isSessionRunning else { return }
        isSessionRunning = false
        arView?.session.pause()
        self.onSessionActiveChanged?(false)
        webView?.reload()
    }
    
    // --- Hit Test Implementation ---
    func performHitTest(x: Double, y: Double, callback: String) {
        guard let arView = arView else { return }
        
        let point = CGPoint(
            x: CGFloat(x) * arView.bounds.width,
            y: CGFloat(y) * arView.bounds.height
        )
        
        // Prioritize existing planes (geometry), then estimated planes
        let queryTypes: [ARRaycastQuery.Target] = [.existingPlaneGeometry, .estimatedPlane, .existingPlaneInfinite]
        var results: [ARRaycastResult] = []
        
        for type in queryTypes {
            if let query = arView.raycastQuery(from: point, allowing: type, alignment: .any) {
                results = arView.session.raycast(query)
                if !results.isEmpty { break }
            }
        }
        
        var hitsPayload: [[String: Any]] = []
        
        for result in results {
            let tf = result.worldTransform
            let tfArray = toArray(tf)
            
            var hitData: [String: Any] = [
                "world_transform": tfArray
            ]
            
            if let anchor = result.anchor {
                hitData["uuid"] = anchor.identifier.uuidString
            }
            
            hitsPayload.append(hitData)
        }
        
        replyToJS(callback: callback, data: hitsPayload)
    }

    // --- ARSessionDelegate ---

    nonisolated func session(_ session: ARSession, didUpdate frame: ARFrame) {
        MainActor.assumeIsolated {
            guard isSessionRunning, let webView = self.webView else { return }

            frameCounter += 1
            let shouldSendVideo = (frameCounter % videoFrameSkip == 0)

            let orientation: UIInterfaceOrientation = .portrait
            let viewportSize = webView.bounds.size

            let viewMatrix = frame.camera.viewMatrix(for: orientation)
            let cameraTransform = viewMatrix.inverse
            let projMatrix = frame.camera.projectionMatrix(
                for: orientation,
                viewportSize: viewportSize,
                zNear: 0.01,
                zFar: 1000
            )

            var jsCommand = "if(!window.NativeARData){window.NativeARData={};}"
            
            jsCommand += "window.NativeARData.timestamp = \(frame.timestamp * 1000);"
            jsCommand += "window.NativeARData.light_intensity = \(frame.lightEstimate?.ambientIntensity ?? 1000);"
            jsCommand += "window.NativeARData.camera_transform = \(fastFloatArrayToString(cameraTransform));"
            jsCommand += "window.NativeARData.camera_view = \(fastFloatArrayToString(viewMatrix));"
            jsCommand += "window.NativeARData.projection_camera = \(fastFloatArrayToString(projMatrix));"

            // Send Video Frame
            let rawWidth = CVPixelBufferGetWidth(frame.capturedImage)
            let rawHeight = CVPixelBufferGetHeight(frame.capturedImage)
            
            // Swap dimensions for portrait
            let finalWidth = rawHeight
            let finalHeight = rawWidth
            
            if shouldSendVideo {
                let pixelBuffer = frame.capturedImage
                let maxDim = max(CGFloat(finalWidth), CGFloat(finalHeight))
                let scale = maxDim > maxVideoDimension ? (maxVideoDimension / maxDim) : 1.0

                if let base64String = convertPixelBufferToBase64(pixelBuffer, scale: scale, quality: 0.5) {
                    jsCommand += "window.NativeARData.video_data = '\(base64String)';"
                    jsCommand += "window.NativeARData.video_width = \(finalWidth);"
                    jsCommand += "window.NativeARData.video_height = \(finalHeight);"
                    jsCommand += "window.NativeARData.video_updated = true;"
                }
            } else {
                 jsCommand += "window.NativeARData.video_updated = false;"
            }

            // Trigger the JS frame loop callback if it exists
            jsCommand += "if(window.arkitCallbackOnData) window.arkitCallbackOnData();"

            webView.evaluateJavaScript(jsCommand, completionHandler: nil)
        }
    }

    // --- Helpers ---

    private func convertPixelBufferToBase64(_ pixelBuffer: CVPixelBuffer, scale: CGFloat, quality: CGFloat)
        -> String?
    {
        var ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        if scale < 1.0 {
            let scaleTransform = CGAffineTransform(scaleX: scale, y: scale)
            ciImage = ciImage.transformed(by: scaleTransform)
        }
        guard let cgImage = ciContext.createCGImage(ciImage, from: ciImage.extent, format: .RGBA8, colorSpace: sRGBColorSpace) else { return nil }
        let uiImage = UIImage(cgImage: cgImage, scale: 1.0, orientation: .right)
        guard let jpegData = uiImage.jpegData(compressionQuality: quality) else { return nil }
        return jpegData.base64EncodedString()
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
        }
    }

    private func fastFloatArrayToString(_ m: simd_float4x4) -> String {
        return "[\(m.columns.0.x),\(m.columns.0.y),\(m.columns.0.z),\(m.columns.0.w)," +
               "\(m.columns.1.x),\(m.columns.1.y),\(m.columns.1.z),\(m.columns.1.w)," +
               "\(m.columns.2.x),\(m.columns.2.y),\(m.columns.2.z),\(m.columns.2.w)," +
               "\(m.columns.3.x),\(m.columns.3.y),\(m.columns.3.z),\(m.columns.3.w)]"
    }
}