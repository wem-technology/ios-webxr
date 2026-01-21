import SwiftUI
import WebXRKit

struct ContentView: View {
    @Binding var externalLoadURL: URL?

    // Web State
    @State private var urlString: String = AppConfig.startURL
    @State private var navAction: WebViewNavigationAction = .load(URL(string: AppConfig.startURL)!)
    @State private var isARActive: Bool = false
    @State private var canGoBack: Bool = false
    @State private var canGoForward: Bool = false
    
    var body: some View {
        ARWebView(
            action: $navAction,
            isARActive: $isARActive,
            currentURLString: $urlString,
            canGoBack: $canGoBack,
            canGoForward: $canGoForward
        )
        .edgesIgnoringSafeArea(.all)
        .statusBar(hidden: true)
        .onChange(of: externalLoadURL) { newURL in
            if let validURL = newURL {
                urlString = validURL.absoluteString
                navAction = .load(validURL)
            }
        }
    }
}