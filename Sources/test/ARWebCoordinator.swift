import Foundation
import ARKit
import SceneKit
import WebKit
import VideoToolbox

@MainActor
class ARWebCoordinator: NSObject, WKNavigationDelegate, ARSessionDelegate, WKScriptMessageHandler {
    weak var webView: WKWebView?
    weak var arView: ARSCNView?
    
    // The name of the global JS function to call with frame data
    var dataCallbackName: String?
    
    var isSessionRunning = false

    // Callback to notify SwiftUI of state changes
    var onSessionActiveChanged: ((Bool) -> Void)?

    // Image processing resources
    let ciContext = CIContext(options: [.useSoftwareRenderer: false])
    // Force unwrapping standard sRGB space is safe on iOS
    let sRGBColorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    
    var frameCounter = 0
    let frameSkip = 15 // Send video frames every 15th frame
    
    // MARK: - WKScriptMessageHandler
    
    func userContentController(
        _ userContentController: WKUserContentController, didReceive message: WKScriptMessage
    ) {
        guard let body = message.body as? [String: Any] else { return }

        // 1. Error Logging Bridge
        if let errorMsg = body["error_message"] as? String {
            print("JS Error: \(errorMsg)")
            return
        }

        switch message.name {
        case "requestSession":
            // IWER Bridge requests a session
            if let options = body["options"] as? [String: Any],
               let dataCallback = body["data_callback"] as? String {
                
                self.dataCallbackName = dataCallback
                self.startARSession(options: options)
                
                // Notify UI
                self.onSessionActiveChanged?(true)
                
                // Acknowledge success
                if let responseCallback = body["callback"] as? String {
                    replyToJS(
                        callback: responseCallback,
                        data: ["webXRAccess": true]
                    )
                }
            }
            
        case "stopAR":
            self.stopSession(notifyJS: false)
            
        case "hitTest":
            // IWER Bridge requests a raycast
            if let x = body["x"] as? Double,
               let y = body["y"] as? Double,
               let callback = body["callback"] as? String {
                self.performHitTest(x: x, y: y, callback: callback)
            }
            
        default: break
        }
    }

    // MARK: - Session Management
    
    func startARSession(options: [String: Any]) {
        guard let arView = arView else { return }
        
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal, .vertical]
        config.isLightEstimationEnabled = true
        
        // Run session
        arView.session.run(config, options: [.resetTracking, .removeExistingAnchors])
        isSessionRunning = true
    }
    
    func stopSession(notifyJS: Bool = true) {
        guard isSessionRunning else { return }
        
        isSessionRunning = false
        arView?.session.pause()
        
        self.onSessionActiveChanged?(false)
        
        // Reload to clean up WebGL context
        print("AR Session stopped. Reloading.")
        webView?.reload()
    }
    
    // MARK: - Hit Testing (Raycasting)
    
    func performHitTest(x: Double, y: Double, callback: String) {
        guard let arView = arView else { return }
        
        // Convert normalized coordinates (0..1) to view point (pixels)
        let point = CGPoint(
            x: CGFloat(x) * arView.bounds.width,
            y: CGFloat(y) * arView.bounds.height
        )
        
        var results: [ARRaycastResult] = []
        
        // 1. Create a Raycast Query for Existing Plane Geometry (Most stable)
        if let query = arView.raycastQuery(from: point, allowing: .existingPlaneGeometry, alignment: .any) {
            results = arView.session.raycast(query)
        }
        
        // 2. Fallback to Estimated Plane if no geometry found
        if results.isEmpty {
            if let query = arView.raycastQuery(from: point, allowing: .estimatedPlane, alignment: .any) {
                results = arView.session.raycast(query)
            }
        }
        
        // Map results to simple JSON array
        let hitsPayload: [[String: Any]] = results.map { result in
            return [
                "world_transform": toArray(result.worldTransform)
            ]
        }
        
        replyToJS(callback: callback, data: hitsPayload)
    }

    // MARK: - ARSessionDelegate (Frame Update)

    nonisolated func session(_ session: ARSession, didUpdate frame: ARFrame) {
        MainActor.assumeIsolated {
            guard isSessionRunning,
                  let webView = self.webView,
                  let callbackName = self.dataCallbackName
            else { return }

            // --- 1. Matrices ---
            let orientation: UIInterfaceOrientation = .portrait
            let viewportSize = webView.bounds.size

            // ARKit Camera Matrices
            // View Matrix (Inverse of Camera Transform)
            let viewMatrix = frame.camera.viewMatrix(for: orientation)
            // Camera Transform (Device Position/Rotation in World)
            let cameraTransform = viewMatrix.inverse
            // Projection Matrix
            let projMatrix = frame.camera.projectionMatrix(
                for: orientation,
                viewportSize: viewportSize,
                zNear: 0.01,
                zFar: 1000
            )

            var payload: [String: Any] = [
                "timestamp": frame.timestamp * 1000,
                "camera_transform": toArray(cameraTransform),
                "projection_camera": toArray(projMatrix)
            ]
            
            // --- 2. Light Estimation ---
            if let lightEst = frame.lightEstimate {
                payload["light_intensity"] = lightEst.ambientIntensity
            }

            // --- 3. Video Feed (Optional) ---
            frameCounter += 1
            if frameCounter % frameSkip == 0 {
                let pixelBuffer = frame.capturedImage
                if let base64String = convertPixelBufferToBase64(pixelBuffer, quality: 0.6) {
                    payload["video_data"] = base64String
                    // Swap dimensions for portrait rotation
                    payload["video_width"] = CVPixelBufferGetHeight(pixelBuffer)
                    payload["video_height"] = CVPixelBufferGetWidth(pixelBuffer)
                }
            }

            // --- 4. Send to JS ---
            if let jsonData = try? JSONSerialization.data(withJSONObject: payload),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                
                let js = "\(callbackName)(\(jsonString));"
                webView.evaluateJavaScript(js, completionHandler: nil)
            }
        }
    }

    // MARK: - Helpers
    
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
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: data),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            let js = "\(callback)(\(jsonString));"
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }
    
    private func convertPixelBufferToBase64(_ pixelBuffer: CVPixelBuffer, quality: CGFloat) -> String? {
        let ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        guard let cgImage = ciContext.createCGImage(ciImage, from: ciImage.extent, format: .RGBA8, colorSpace: sRGBColorSpace) else {
            return nil
        }
        // Rotate 90 degrees for Portrait
        let uiImage = UIImage(cgImage: cgImage, scale: 1.0, orientation: .right)
        guard let jpegData = uiImage.jpegData(compressionQuality: quality) else { return nil }
        return jpegData.base64EncodedString()
    }
}