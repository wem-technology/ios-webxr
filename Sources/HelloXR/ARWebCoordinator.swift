import Foundation
import ARKit
import SceneKit
import WebKit
import CoreImage

@MainActor
class ARWebCoordinator: NSObject, WKNavigationDelegate, ARSessionDelegate, WKScriptMessageHandler {
    weak var webView: WKWebView?
    weak var arView: ARSCNView?
    var dataCallbackName: String?
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

    let ciContext = CIContext(options: [.useSoftwareRenderer: false])
    let sRGBColorSpace = CGColorSpace(name: CGColorSpace.sRGB)!

    var frameCounter = 0
    let videoFrameSkip = 4 
    
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
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal, .vertical]
        arView?.session.run(config, options: [.resetTracking, .removeExistingAnchors])
        isSessionRunning = true
    }
    
    func stopSession(notifyJS: Bool = true) {
        guard isSessionRunning else { return }
        isSessionRunning = false
        arView?.session.pause()
        self.onSessionActiveChanged?(false)
        print("AR Session stopped. Reloading web page.")
        webView?.reload()
    }
    
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
            var hitData: [String: Any] = ["world_transform": toArray(tf)]
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

            frameCounter += 1
            let shouldSendVideo = (frameCounter % videoFrameSkip == 0)

            let viewportSize = webView.bounds.size
            let orientation: UIInterfaceOrientation = .portrait

            let viewMatrix = frame.camera.viewMatrix(for: orientation)
            let cameraTransform = viewMatrix.inverse
            
            let projMatrix = frame.camera.projectionMatrix(
                for: orientation,
                viewportSize: viewportSize,
                zNear: 0.001,
                zFar: 1000
            )

            var jsCommand = "if(!window.NativeARData){window.NativeARData={};}"
            
            jsCommand += "window.NativeARData.timestamp = \(frame.timestamp * 1000);"
            jsCommand += "window.NativeARData.light_intensity = \(frame.lightEstimate?.ambientIntensity ?? 1000);"
            jsCommand += "window.NativeARData.worldMappingStatus = 'ar_worldmapping_not_available';"
            
            jsCommand += "window.NativeARData.camera_transform = \(fastFloatArrayToString(cameraTransform));"
            jsCommand += "window.NativeARData.camera_view = \(fastFloatArrayToString(viewMatrix));"
            jsCommand += "window.NativeARData.projection_camera = \(fastFloatArrayToString(projMatrix));"

            if shouldSendVideo {
                let conversionResult = processCameraImage(frame.capturedImage, viewportSize: viewportSize)
                
                if let result = conversionResult {
                    jsCommand += "window.NativeARData.video_data = '\(result.base64)';"
                    jsCommand += "window.NativeARData.video_width = \(result.width);"
                    jsCommand += "window.NativeARData.video_height = \(result.height);"
                    jsCommand += "window.NativeARData.video_updated = true;"
                }
            } else {
                 jsCommand += "window.NativeARData.video_updated = false;"
            }

            jsCommand += "\(callbackName)();"

            webView.evaluateJavaScript(jsCommand, completionHandler: nil)
        }
    }

    struct ProcessedImage {
        let base64: String
        let width: Int
        let height: Int
    }

    private func processCameraImage(_ pixelBuffer: CVPixelBuffer, viewportSize: CGSize) -> ProcessedImage? {
        var ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        ciImage = ciImage.oriented(.right)
        
        let imgWidth = ciImage.extent.width
        let imgHeight = ciImage.extent.height
        
        if imgWidth == 0 || imgHeight == 0 || viewportSize.width == 0 || viewportSize.height == 0 {
            return nil
        }
        
        let imageAspect = imgWidth / imgHeight
        let viewportAspect = viewportSize.width / viewportSize.height
        
        var cropRect = ciImage.extent
        
        if imageAspect > viewportAspect {
            let newWidth = imgHeight * viewportAspect
            let xOffset = (imgWidth - newWidth) / 2.0
            cropRect = CGRect(x: xOffset, y: 0, width: newWidth, height: imgHeight)
        } else {
            let newHeight = imgWidth / viewportAspect
            let yOffset = (imgHeight - newHeight) / 2.0
            cropRect = CGRect(x: 0, y: yOffset, width: imgWidth, height: newHeight)
        }
        
        // 1. Crop to aspect ratio
        let croppedImage = ciImage.cropped(to: cropRect)
        
        // 2. Reduce resolution by 2x
        let scaledImage = croppedImage.transformed(by: CGAffineTransform(scaleX: 0.5, y: 0.5))
        
        guard let jpegData = ciContext.jpegRepresentation(
            of: scaledImage,
            colorSpace: sRGBColorSpace
        ) else {
            return nil
        }
        
        return ProcessedImage(
            base64: jpegData.base64EncodedString(),
            width: Int(scaledImage.extent.width),
            height: Int(scaledImage.extent.height)
        )
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