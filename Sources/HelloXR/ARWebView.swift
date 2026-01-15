import SwiftUI
import ARKit
import SceneKit
import WebKit

// Enum to control WebView actions from SwiftUI
enum WebViewNavigationAction: Equatable {
    case idle
    case load(URL)
    case goBack
    case goForward
    case reload
}

struct ARWebView: UIViewRepresentable {
    // Control bindings
    @Binding var action: WebViewNavigationAction
    @Binding var isARActive: Bool
    
    // State reporting bindings
    @Binding var currentURLString: String
    @Binding var canGoBack: Bool
    @Binding var canGoForward: Bool

    private var resourceBundle: Bundle {
        #if SWIFT_PACKAGE
        return Bundle.module
        #else
        return Bundle.main
        #endif
    }

    func makeUIView(context: Context) -> UIView {
        let containerView = UIView()
        containerView.backgroundColor = .systemBackground
        
        // 1. Create AR View
        let arView = ARSCNView(frame: .zero)
        arView.automaticallyUpdatesLighting = true
        arView.translatesAutoresizingMaskIntoConstraints = false
        
        // 2. Create Web View
        let webConfig = WKWebViewConfiguration()
        webConfig.allowsInlineMediaPlayback = true
        let contentController = webConfig.userContentController
        
        // Register handlers
        contentController.add(context.coordinator, name: "initAR")
        contentController.add(context.coordinator, name: "requestSession")
        contentController.add(context.coordinator, name: "stopAR")
        contentController.add(context.coordinator, name: "hitTest")

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

        if let url = resourceBundle.url(forResource: "webxr-polyfill", withExtension: "js"),
           let polyfillSource = try? String(contentsOf: url)
        {
            let userScript = WKUserScript(
                source: polyfillSource, injectionTime: .atDocumentStart, forMainFrameOnly: true)
            contentController.addUserScript(userScript)
        }
        
        let webView = WKWebView(frame: .zero, configuration: webConfig)
        if #available(iOS 16.4, *) { webView.isInspectable = true }
        
        // Default state: Opaque (Normal Browsing)
        webView.isOpaque = true
        webView.backgroundColor = .systemBackground
        webView.scrollView.backgroundColor = .systemBackground
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.scrollView.bounces = false

        // 3. Assemble View Hierarchy
        // Container -> ARView (Back) -> WebView (Front)
        containerView.addSubview(arView)
        containerView.addSubview(webView)
        
        NSLayoutConstraint.activate([
            // AR View Full Fill
            arView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            arView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            arView.topAnchor.constraint(equalTo: containerView.topAnchor),
            arView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
            
            // Web View Full Fill
            webView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            webView.topAnchor.constraint(equalTo: containerView.topAnchor),
            webView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
        ])

        // 4. Hook up Coordinator
        context.coordinator.webView = webView
        context.coordinator.arView = arView
        webView.navigationDelegate = context.coordinator
        arView.session.delegate = context.coordinator

        return containerView
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        guard let webView = context.coordinator.webView,
              let arView = context.coordinator.arView else { return }
        
        if isARActive {
            // AR Mode: Show AR View, Make Web Transparent
            arView.isHidden = false
            webView.isOpaque = false
            webView.backgroundColor = .clear
            webView.scrollView.backgroundColor = .clear
        } else {
            // Browse Mode: Hide AR View (Kills the ghost frame), Make Web Opaque
            arView.isHidden = true
            webView.isOpaque = true
            webView.backgroundColor = .systemBackground
            webView.scrollView.backgroundColor = .systemBackground
        }
        
        // Handle Navigation Actions
        switch action {
        case .idle:
            break
        case .load(let url):
            webView.load(URLRequest(url: url))
            DispatchQueue.main.async { self.action = .idle }
        case .goBack:
            webView.goBack()
            DispatchQueue.main.async { self.action = .idle }
        case .goForward:
            webView.goForward()
            DispatchQueue.main.async { self.action = .idle }
        case .reload:
            webView.reload()
            DispatchQueue.main.async { self.action = .idle }
        }
        
        // Safety check
        if !isARActive && context.coordinator.isSessionRunning {
            context.coordinator.stopSession()
        }
    }

    func makeCoordinator() -> ARWebCoordinator {
        let coordinator = ARWebCoordinator()
        
        coordinator.onSessionActiveChanged = { isActive in
            self.isARActive = isActive
        }
        
        coordinator.onNavigationChanged = { [weak coordinator] in
            guard let webView = coordinator?.webView else { return }
            self.canGoBack = webView.canGoBack
            self.canGoForward = webView.canGoForward
            if let currentUrl = webView.url?.absoluteString {
                self.currentURLString = currentUrl
            }
        }
        
        return coordinator
    }
}