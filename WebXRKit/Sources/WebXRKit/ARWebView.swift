import SwiftUI
import ARKit
import SceneKit
import WebKit

/// Enum to control WebView actions from SwiftUI
public enum WebViewNavigationAction: Equatable {
    case idle
    case load(URL)
    case goBack
    case goForward
    case reload
}

/// A SwiftUI view that bridges ARKit to WKWebView, enabling WebXR experiences on iOS.
/// This view combines an ARSCNView (for camera passthrough) with a WKWebView (for web content)
/// and injects a JavaScript polyfill to enable WebXR API support.
@available(iOS 16.0, *)
public struct ARWebView: UIViewRepresentable {
    // Control bindings
    @Binding public var action: WebViewNavigationAction
    @Binding public var isARActive: Bool
    
    // State reporting bindings
    @Binding public var currentURLString: String
    @Binding public var canGoBack: Bool
    @Binding public var canGoForward: Bool

    private var resourceBundle: Bundle {
        #if SWIFT_PACKAGE
        return Bundle.module
        #else
        return Bundle.main
        #endif
    }

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

    @MainActor
    public func makeUIView(context: Context) -> UIView {
        let containerView = UIView()
        containerView.backgroundColor = .systemBackground
        
        // 1. Create AR View
        let arView = ARSCNView(frame: .zero)
        arView.automaticallyUpdatesLighting = true
        arView.translatesAutoresizingMaskIntoConstraints = false
        arView.clipsToBounds = false

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
        
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.bounces = false
        //important for full screen
        webView.scrollView.contentInsetAdjustmentBehavior = .never
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

    @MainActor
    public func updateUIView(_ uiView: UIView, context: Context) {
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

    @MainActor
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
