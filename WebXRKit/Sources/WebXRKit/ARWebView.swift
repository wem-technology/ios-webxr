import ARKit
import SceneKit
import SwiftUI
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
@available(iOS 16.0, *)
public struct ARWebView: View {
    @Binding public var action: WebViewNavigationAction
    @Binding public var isARActive: Bool
    @Binding public var currentURLString: String
    @Binding public var canGoBack: Bool
    @Binding public var canGoForward: Bool

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

    public var body: some View {
        _ARWebViewRepresentable(
            action: $action,
            isARActive: $isARActive,
            currentURLString: $currentURLString,
            canGoBack: $canGoBack,
            canGoForward: $canGoForward
        )
        .ignoresSafeArea(isARActive ? .all : [])
    }
}

// MARK: - Internal Implementation

@available(iOS 16.0, *)
private struct _ARWebViewRepresentable: UIViewRepresentable {
    @Binding var action: WebViewNavigationAction
    @Binding var isARActive: Bool
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

    @MainActor
    func makeUIView(context: Context) -> UIView {
        let containerView = UIView()
        containerView.backgroundColor = .systemBackground

        let arView = ARSCNView(frame: .zero)
        arView.automaticallyUpdatesLighting = true
        arView.translatesAutoresizingMaskIntoConstraints = false
        arView.clipsToBounds = false

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
        webView.scrollView.contentInsetAdjustmentBehavior = .never
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

    @MainActor
    func updateUIView(_ uiView: UIView, context: Context) {
        guard let webView = context.coordinator.webView,
            let arView = context.coordinator.arView
        else { return }

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
        case .idle: break
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

    @MainActor
    func makeCoordinator() -> ARWebCoordinator {
        let coordinator = ARWebCoordinator()

        coordinator.onSessionActiveChanged = { isActive in
            // Use a Transaction to disable animations for the safe area toggle.
            // This ensures the layout snaps instantly to full screen.
            var transaction = Transaction()
            transaction.disablesAnimations = true
            withTransaction(transaction) {
                self.isARActive = isActive
            }
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
