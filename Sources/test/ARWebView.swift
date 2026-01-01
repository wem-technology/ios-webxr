import SwiftUI
import ARKit
import SceneKit
import WebKit

struct ARWebView: UIViewRepresentable {
    let url: URL
    @Binding var isARActive: Bool

    func makeUIView(context: Context) -> ARSCNView {
        let arView = ARSCNView(frame: .zero)
        arView.automaticallyUpdatesLighting = true

        let webConfig = WKWebViewConfiguration()
        webConfig.allowsInlineMediaPlayback = true
        webConfig.mediaTypesRequiringUserActionForPlayback = []

        let contentController = webConfig.userContentController
        
        // --- Register Handlers ---
        contentController.add(context.coordinator, name: "initAR")
        contentController.add(context.coordinator, name: "requestSession")
        contentController.add(context.coordinator, name: "stopAR")
        contentController.add(context.coordinator, name: "hitTest")

        // =================================================================
        // INJECTION ORDER IS CRITICAL
        // All scripts are injected .atDocumentStart to exist before
        // the page's <head> scripts run.
        // =================================================================

        // --- 3. IWER Core ---
        // Load from LOCAL bundle. This defines 'IWER', 'XRSystem', etc.
        if let iwerURL = Bundle.module.url(forResource: "iwer.min", withExtension: "js"), // Ensure file is named iwer.min.js in bundle
           let iwerSource = try? String(contentsOf: iwerURL) {
            
            let iwerScript = WKUserScript(source: iwerSource, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            contentController.addUserScript(iwerScript)
        } else {
            print("CRITICAL: iwer.min.js not found in bundle. WebXR will fail.")
        }

        // --- 4. IWER Bridge ---
        // Defines ARKitIWERDevice and extends IWER.
        if let bridgeURL = Bundle.module.url(forResource: "iwer-bridge", withExtension: "js"),
           let bridgeSource = try? String(contentsOf: bridgeURL) {
            
            let bridgeScript = WKUserScript(source: bridgeSource, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            contentController.addUserScript(bridgeScript)
        }

        // --- 5. Install Runtime ---
        // Actually triggers the polyfill logic.
        let installSource = """
            console.log("[Native] Installing IWER Runtime...");
            try {
                if (typeof ARKitIWERDevice !== 'undefined') {
                    const device = new ARKitIWERDevice();
                    device.installRuntime();
                    console.log("[Native] Runtime installed successfully.");
                } else {
                    console.error("[Native] ARKitIWERDevice not found.");
                }
            } catch(e) {
                console.error("[Native] Installation failed: " + e);
            }
        """
        let installScript = WKUserScript(source: installSource, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        contentController.addUserScript(installScript)
        
        // =================================================================

        // --- Setup WebView ---
        let webView = WKWebView(frame: .zero, configuration: webConfig)
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.isScrollEnabled = false
        // Allow inspecting in Safari (macOS) if you attach the device
        webView.isInspectable = true 

        webView.translatesAutoresizingMaskIntoConstraints = false
        arView.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: arView.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: arView.trailingAnchor),
            webView.topAnchor.constraint(equalTo: arView.topAnchor),
            webView.bottomAnchor.constraint(equalTo: arView.bottomAnchor),
        ])

        context.coordinator.webView = webView
        context.coordinator.arView = arView
        webView.navigationDelegate = context.coordinator
        arView.session.delegate = context.coordinator

        // --- Load Page ---
        let request = URLRequest(url: url)
        webView.load(request)

        return arView
    }

    func updateUIView(_ uiView: ARSCNView, context: Context) {
        guard let webView = context.coordinator.webView else { return }
        
        if webView.url?.absoluteString != url.absoluteString {
            webView.load(URLRequest(url: url))
        }
        
        if !isARActive && context.coordinator.isSessionRunning {
            context.coordinator.stopSession()
        }
    }

    func makeCoordinator() -> ARWebCoordinator {
        let coordinator = ARWebCoordinator()
        coordinator.onSessionActiveChanged = { isActive in
            self.isARActive = isActive
        }
        return coordinator
    }
}