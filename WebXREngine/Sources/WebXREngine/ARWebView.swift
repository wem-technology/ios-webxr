import SwiftUI
import ARKit
import SceneKit
import WebKit

public struct ARWebView: UIViewRepresentable {
    // Make bindings public
    @Binding public var action: WebViewNavigationAction
    @Binding public var isARActive: Bool
    
    @Binding public var currentURLString: String
    @Binding public var canGoBack: Bool
    @Binding public var canGoForward: Bool

    // Public Initializer
    public init(
        action: Binding<WebViewNavigationAction>,
        isARActive: Binding<Bool>,
        currentURLString: Binding<String>,
        canGoBack: Binding<Bool>,
        canGoForward: Binding<Bool>
    ) {
        self._action = action
        self._isARActive = isARActive
        self._currentURLString = currentURLString
        self._canGoBack = canGoBack
        self._canGoForward = canGoForward
    }

    public func makeUIView(context: Context) -> UIView {
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

        // --- CRITICAL CHANGE: Use Bundle.module for Swift Packages ---
        if let url = Bundle.module.url(forResource: "webxr-polyfill", withExtension: "js"),
           let polyfillSource = try? String(contentsOf: url)
        {
            let userScript = WKUserScript(
                source: polyfillSource, injectionTime: .atDocumentStart, forMainFrameOnly: true)
            contentController.addUserScript(userScript)
        } else {
            print("CRITICAL ERROR: Could not load webxr-polyfill.js from Package Bundle")
        }
        
        let webView = WKWebView(frame: .zero, configuration: webConfig)
        if #available(iOS 16.4, *) { webView.isInspectable = true }
        
        webView.isOpaque = true
        webView.backgroundColor = .systemBackground
        webView.scrollView.backgroundColor = .systemBackground
        webView.translatesAutoresizingMaskIntoConstraints = false

        containerView.addSubview(arView)
        containerView.addSubview(webView)
        
        NSLayoutConstraint.activate([
            arView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            arView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            arView.topAnchor.constraint(equalTo: containerView.topAnchor),
            arView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
            
            webView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            webView.topAnchor.constraint(equalTo: containerView.topAnchor),
            webView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
        ])

        context.coordinator.webView = webView
        context.coordinator.arView = arView
        webView.navigationDelegate = context.coordinator
        arView.session.delegate = context.coordinator

        return containerView
    }

    public func updateUIView(_ uiView: UIView, context: Context) {
        guard let webView = context.coordinator.webView,
              let arView = context.coordinator.arView else { return }
        
        if isARActive {
            arView.isHidden = false
            webView.isOpaque = false
            webView.backgroundColor = .clear
            webView.scrollView.backgroundColor = .clear
        } else {
            arView.isHidden = true
            webView.isOpaque = true
            webView.backgroundColor = .systemBackground
            webView.scrollView.backgroundColor = .systemBackground
        }
        
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
        
        if !isARActive && context.coordinator.isSessionRunning {
            context.coordinator.stopSession()
        }
    }

    public func makeCoordinator() -> ARWebCoordinator {
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