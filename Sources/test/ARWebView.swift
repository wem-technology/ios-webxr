import SwiftUI
import ARKit
import SceneKit
import WebKit

struct ARWebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> ARSCNView {
        let arView = ARSCNView(frame: .zero)
        arView.automaticallyUpdatesLighting = true

        let webConfig = WKWebViewConfiguration()
        webConfig.allowsInlineMediaPlayback = true

        let contentController = webConfig.userContentController
        
        // Register script message handlers
        contentController.add(context.coordinator, name: "initAR")
        contentController.add(context.coordinator, name: "requestSession")
        contentController.add(context.coordinator, name: "stopAR")

        // 1. Better Error Handling Injection
        let errorScript = WKUserScript(
            source: """
                    window.onerror = function(message, source, lineno, colno, error) {
                        window.webkit.messageHandlers.initAR.postMessage({
                            "callback": "console_error_bridge",
                            "error_message": message
                        });
                    };
                """, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        contentController.addUserScript(errorScript)

        // 2. Load Polyfill
        if let url = Bundle.module.url(forResource: "webxr-polyfill", withExtension: "js"),
            let polyfillSource = try? String(contentsOf: url)
        {
            let userScript = WKUserScript(
                source: polyfillSource, injectionTime: .atDocumentStart, forMainFrameOnly: true)
            contentController.addUserScript(userScript)
        }

        let webView = WKWebView(frame: .zero, configuration: webConfig)
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear

        webView.translatesAutoresizingMaskIntoConstraints = false
        arView.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: arView.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: arView.trailingAnchor),
            webView.topAnchor.constraint(equalTo: arView.topAnchor),
            webView.bottomAnchor.constraint(equalTo: arView.bottomAnchor),
        ])

        // Connect the Coordinator to the views
        context.coordinator.webView = webView
        context.coordinator.arView = arView

        webView.navigationDelegate = context.coordinator
        arView.session.delegate = context.coordinator

        return arView
    }

    func updateUIView(_ uiView: ARSCNView, context: Context) {
        guard let webView = context.coordinator.webView else { return }
        
        // Load the URL if it differs from the current one or if the webview is empty
        if webView.url?.absoluteString != url.absoluteString {
            webView.load(URLRequest(url: url))
        }
    }

    func makeCoordinator() -> ARWebCoordinator {
        ARWebCoordinator()
    }
}