import Foundation
import ARKit
import SceneKit
import WebKit
import ImageIO

// Helper class for thread-safe state sharing between MainActor and Background Queue
class ARSharedState: @unchecked Sendable {
    private var viewportSize: CGSize = .zero
    private let lock = NSLock()
    
    func setViewportSize(_ size: CGSize) {
        lock.lock()
        viewportSize = size
        lock.unlock()
    }
    
    func getViewportSize() -> CGSize {
        lock.lock()
        let size = viewportSize
        lock.unlock()
        return size
    }
}

@MainActor
class ARWebCoordinator: NSObject, WKNavigationDelegate, ARSessionDelegate, WKScriptMessageHandler {
    weak var webView: WKWebView?
    weak var arView: ARSCNView?
    var dataCallbackName: String?
    var isSessionRunning = false

    var onSessionActiveChanged: ((Bool) -> Void)?
    var onNavigationChanged: (() -> Void)?

    // --- Thread Safety / Performance ---
    
    // Background serial queue for heavy image processing
    nonisolated private let arProcessingQueue = DispatchQueue(label: "com.helloxr.arprocessing", qos: .userInteractive)
    
    // Shared state container to bypass MainActor isolation for specific properties
    nonisolated private let sharedState = ARSharedState()
    
    // Reuse CIContext for performance (thread-safe)
    nonisolated let ciContext = CIContext(options: [
        .useSoftwareRenderer: false,
        .cacheIntermediates: false
    ])
    nonisolated let sRGBColorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    
    // --- Viewport Management ---
    
    func updateViewportSize(_ size: CGSize) {
        sharedState.setViewportSize(size)
    }

    // --- Delegates ---

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        onNavigationChanged?()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        onNavigationChanged?()
    }
    
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        onNavigationChanged?()
    }

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
            if let options = body["options"] as? [String: Any],
               let callbackName = body["data_callback"] as? String
            {
                self.dataCallbackName = callbackName
                self.startARSession(options: options)
                
                self.onSessionActiveChanged?(true)
                
                if let responseCallback = body["callback"] as? String {
                    replyToJS(
                        callback: responseCallback,
                        data: ["cameraAccess": true, "worldAccess": true, "webXRAccess": true])
                }
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
        guard let arView = arView else { return }
        
        // Delegate callbacks will run on this background queue
        arView.session.delegateQueue = arProcessingQueue
        
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal, .vertical]
        
        if let cameraFormat = ARWorldTrackingConfiguration.supportedVideoFormats.first {
            config.videoFormat = cameraFormat
            config.isAutoFocusEnabled = true
        }
        
        arView.session.run(config, options: [.resetTracking, .removeExistingAnchors])
        isSessionRunning = true
    }
    
    func stopSession(notifyJS: Bool = true) {
        guard isSessionRunning else { return }
        
        isSessionRunning = false
        arView?.session.pause()
        
        self.onSessionActiveChanged?(false)
        print("AR Session stopped. Reloading web page to clean state.")
        webView?.reload()
    }
    
    // --- Hit Test (Runs on Main Actor) ---
    func performHitTest(x: Double, y: Double, callback: String) {
        guard let arView = arView else { return }
        
        let point = CGPoint(
            x: CGFloat(x) * arView.bounds.width,
            y: CGFloat(y) * arView.bounds.height
        )
        
        var results: [ARRaycastResult] = []
        
        if let query = arView.raycastQuery(from: point, allowing: .existingPlaneGeometry, alignment: .any) {
            results = arView.session.raycast(query)
        }
        
        if results.isEmpty {
            if let query = arView.raycastQuery(from: point, allowing: .estimatedPlane, alignment: .any) {
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

    // --- ARSessionDelegate (Background Thread) ---
    nonisolated func session(_ session: ARSession, didUpdate frame: ARFrame) {
        let currentViewport = sharedState.getViewportSize()

        if currentViewport.width == 0 || currentViewport.height == 0 { return }

        // Send roughly every ~66ms (15fps)
        let sendVideo = (frame.timestamp.truncatingRemainder(dividingBy: 0.066) < 0.016)

        let orientation: UIInterfaceOrientation = .portrait

        let viewMatrix = frame.camera.viewMatrix(for: orientation)
        let cameraTransform = viewMatrix.inverse
        
        let projMatrix = frame.camera.projectionMatrix(
            for: orientation,
            viewportSize: currentViewport,
            zNear: 0.01,
            zFar: 1000
        )

        var jsCommand = "if(!window.NativeARData){window.NativeARData={};}"
        
        jsCommand += "window.NativeARData.timestamp = \(frame.timestamp * 1000);"
        jsCommand += "window.NativeARData.light_intensity = \(frame.lightEstimate?.ambientIntensity ?? 1000);"
        jsCommand += "window.NativeARData.worldMappingStatus = 'ar_worldmapping_not_available';"
        
        // These calls are now valid because the helper is nonisolated
        jsCommand += "window.NativeARData.camera_transform = \(fastFloatArrayToString(cameraTransform));"
        jsCommand += "window.NativeARData.camera_view = \(fastFloatArrayToString(viewMatrix));"
        jsCommand += "window.NativeARData.projection_camera = \(fastFloatArrayToString(projMatrix));"

        let rawWidth = CVPixelBufferGetWidth(frame.capturedImage)
        let rawHeight = CVPixelBufferGetHeight(frame.capturedImage)
        
        let finalWidth = rawHeight
        let finalHeight = rawWidth
        
        if sendVideo {
            // This call is now valid because the helper is nonisolated
            if let base64String = convertPixelBufferToJPEG(frame.capturedImage, quality: 0.5) {
                jsCommand += "window.NativeARData.video_data = '\(base64String)';"
                jsCommand += "window.NativeARData.video_width = \(finalWidth);"
                jsCommand += "window.NativeARData.video_height = \(finalHeight);"
                jsCommand += "window.NativeARData.video_updated = true;"
            } else {
                 jsCommand += "window.NativeARData.video_updated = false;"
            }
        } else {
             jsCommand += "window.NativeARData.video_updated = false;"
        }

        Task { @MainActor in
            guard self.isSessionRunning,
                  let callbackName = self.dataCallbackName,
                  let webView = self.webView else { return }
            
            jsCommand += "\(callbackName)();"
            webView.evaluateJavaScript(jsCommand, completionHandler: nil)
        }
    }

    // --- Helpers (Nonisolated) ---

    nonisolated private func convertPixelBufferToJPEG(_ pixelBuffer: CVPixelBuffer, quality: CGFloat) -> String? {
        let ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        
        let height = CGFloat(CVPixelBufferGetHeight(pixelBuffer))
        let transform = CGAffineTransform(rotationAngle: -CGFloat.pi / 2)
            .translatedBy(x: -height, y: 0)
        
        let rotatedImage = ciImage.transformed(by: transform)
        
        // Use ImageIO keys for JPEG compression quality
        let options: [CIImageRepresentationOption: Any] = [
            .init(rawValue: kCGImageDestinationLossyCompressionQuality as String): quality
        ]
        
        guard let jpegData = ciContext.jpegRepresentation(
            of: rotatedImage,
            colorSpace: sRGBColorSpace,
            options: options
        ) else {
            return nil
        }

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
    
    nonisolated private func fastFloatArrayToString(_ m: simd_float4x4) -> String {
        return "[\(m.columns.0.x),\(m.columns.0.y),\(m.columns.0.z),\(m.columns.0.w)," +
               "\(m.columns.1.x),\(m.columns.1.y),\(m.columns.1.z),\(m.columns.1.w)," +
               "\(m.columns.2.x),\(m.columns.2.y),\(m.columns.2.z),\(m.columns.2.w)," +
               "\(m.columns.3.x),\(m.columns.3.y),\(m.columns.3.z),\(m.columns.3.w)]"
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
}