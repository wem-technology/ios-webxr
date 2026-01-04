import Foundation
import ARKit
import SceneKit
import WebKit
import VideoToolbox

@MainActor
class ARWebCoordinator: NSObject, WKNavigationDelegate, ARSessionDelegate, WKScriptMessageHandler {
    weak var webView: WKWebView?
    weak var arView: ARSCNView?
    var dataCallbackName: String?
    var isSessionRunning = false

    // Callback to notify SwiftUI when session state changes (true = running, false = stopped)
    var onSessionActiveChanged: ((Bool) -> Void)?

    // Reuse CIContext for performance (creating this every frame is expensive)
    let ciContext = CIContext(options: [.useSoftwareRenderer: false])
    // Cache the sRGB color space
    let sRGBColorSpace = CGColorSpace(name: CGColorSpace.sRGB)!

    // Throttling for image sending to maintain FPS
    var frameCounter = 0
    let frameSkip = 15
    
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
                
                // Notify UI to hide address bar
                self.onSessionActiveChanged?(true)
                
                if let responseCallback = body["callback"] as? String {
                    replyToJS(
                        callback: responseCallback,
                        data: ["cameraAccess": true, "worldAccess": true, "webXRAccess": true])
                }
            }
        case "stopAR":
            // JS requested stop
            self.stopSession(notifyJS: false)
            
        case "hitTest":
            // --- FIX: Handle Hit Testing using modern Raycast API ---
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
        arView?.session.run(config, options: [.resetTracking, .removeExistingAnchors])
        isSessionRunning = true
    }
    
    // Helper to stop session from either JS or SwiftUI
    func stopSession(notifyJS: Bool = true) {
        guard isSessionRunning else { return }
        
        // 1. Stop Native Session immediately
        isSessionRunning = false
        arView?.session.pause()
        
        // 2. Notify UI to show address bar again
        self.onSessionActiveChanged?(false)
        
        // 3. Force Reload the Page
        // This ensures the WebGL context, video textures, and JS loops 
        // are completely destroyed, preventing the "frozen frame" issue.
        print("AR Session stopped. Reloading web page to clean state.")
        webView?.reload()
    }
    
    // --- Hit Test Implementation (Updated to Raycast) ---
    func performHitTest(x: Double, y: Double, callback: String) {
        guard let arView = arView else { return }
        
        // Convert normalized coords (0..1) to view coords (pixels)
        let point = CGPoint(
            x: CGFloat(x) * arView.bounds.width,
            y: CGFloat(y) * arView.bounds.height
        )
        
        // Use modern Raycast Query instead of deprecated hitTest.
        // We prioritize finding existing plane geometry.
        // If that fails, we fall back to estimated planes.
        
        var results: [ARRaycastResult] = []
        
        // 1. Try Existing Plane Geometry (Most stable)
        if let query = arView.raycastQuery(from: point, allowing: .existingPlaneGeometry, alignment: .any) {
            results = arView.session.raycast(query)
        }
        
        // 2. If no existing plane, try Estimated Plane (Instant, but less accurate)
        if results.isEmpty {
            if let query = arView.raycastQuery(from: point, allowing: .estimatedPlane, alignment: .any) {
                results = arView.session.raycast(query)
            }
        }
        
        var hitsPayload: [[String: Any]] = []
        
        for result in results {
            // Convert transform to array
            let tf = result.worldTransform
            let tfArray = toArray(tf)
            
            var hitData: [String: Any] = [
                "world_transform": tfArray
            ]
            
            // If it hit an existing anchor (plane), pass the UUID so the polyfill can map it
            if let anchor = result.anchor {
                hitData["uuid"] = anchor.identifier.uuidString
            }
            
            hitsPayload.append(hitData)
        }
        
        replyToJS(callback: callback, data: hitsPayload)
    }

    nonisolated func session(_ session: ARSession, didUpdate frame: ARFrame) {
        MainActor.assumeIsolated {
            guard isSessionRunning,
                let webView = self.webView,
                let callbackName = self.dataCallbackName
            else { return }

            // Throttle image processing
            frameCounter += 1
            let shouldSendImage = (frameCounter % frameSkip == 0)

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

            // IMPORTANT: Calculate dimensions based on rotation
            // ARKit buffers are usually landscape. Since we rotate to .right (Portrait),
            // we must swap width and height for the JS payload.
            let rawWidth = CVPixelBufferGetWidth(frame.capturedImage)
            let rawHeight = CVPixelBufferGetHeight(frame.capturedImage)

            // Assuming we rotate 90 degrees (see convertPixelBufferToBase64)
            let finalWidth = rawHeight
            let finalHeight = rawWidth

            var payload: [String: Any] = [
                "timestamp": frame.timestamp * 1000,
                "light_intensity": frame.lightEstimate?.ambientIntensity ?? 1000,
                "camera_transform": toArray(cameraTransform),
                "camera_view": toArray(viewMatrix),
                "projection_camera": toArray(projMatrix),
                "worldMappingStatus": "ar_worldmapping_not_available",
                "objects": [],
                "newObjects": [],
                "removedObjects": [],
            ]

            // --- IMAGE PROCESSING START ---
            if shouldSendImage {
                let pixelBuffer = frame.capturedImage
                // Convert CVPixelBuffer to JPEG Base64 with forced sRGB
                if let base64String = convertPixelBufferToBase64(pixelBuffer, quality: 0.6) {
                    payload["video_data"] = base64String
                    // Send the swapped dimensions so WebGL textures aren't skewed
                    payload["video_width"] = finalWidth
                    payload["video_height"] = finalHeight
                }
            }
            // --- IMAGE PROCESSING END ---

            if let jsonData = try? JSONSerialization.data(withJSONObject: payload),
                let jsonString = String(data: jsonData, encoding: .utf8)
            {
                let js = """
                        try {
                            \(callbackName)(\(jsonString));
                        } catch(e) {
                            console.error("ARKit Polyfill Error:", e.message);
                        }
                        """
                webView.evaluateJavaScript(js, completionHandler: nil)
            }
        }
    }

    // Helper: Convert CVPixelBuffer to JPEG Base64
    private func convertPixelBufferToBase64(_ pixelBuffer: CVPixelBuffer, quality: CGFloat)
        -> String?
    {
        let ciImage = CIImage(cvPixelBuffer: pixelBuffer)

        // Create a CGImage using the explicit sRGB color space to fix "Dark" images
        guard
            let cgImage = ciContext.createCGImage(
                ciImage, from: ciImage.extent, format: .RGBA8, colorSpace: sRGBColorSpace)
        else {
            return nil
        }

        // Convert to UIImage then JPEG Data
        // orientation: .right handles the 90 degree rotation from Camera Sensor -> UI
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
            // Removed the redundant "as? Any" check here to fix the compiler warning.
            // JSONSerialization will implicitly handle valid Objects/Arrays or throw error.
            webView.evaluateJavaScript("\(callback)(\(jsonString))")
        }
    }
}