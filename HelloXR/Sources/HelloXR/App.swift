import SwiftUI

@main
struct HelloXRApp: App {
    // This state acts as the bridge between the App Clip invocation and the WebView
    @State private var deepLinkURL: URL?

    var body: some Scene {
        WindowGroup {
            // Pass the binding into ContentView
            ContentView(externalLoadURL: $deepLinkURL)
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { activity in
                    handleUserActivity(activity)
                }
        }
    }
    
    func handleUserActivity(_ activity: NSUserActivity) {
        guard let incomingURL = activity.webpageURL else { return }
        
        // Logic: Check if url is helloxr.app/?to=...
        // We look for the "to" query parameter
        if let components = URLComponents(url: incomingURL, resolvingAgainstBaseURL: true),
           let queryItems = components.queryItems,
           let toValue = queryItems.first(where: { $0.name == "to" })?.value,
           let targetURL = URL(string: toValue) {
            
            print("App Clip Invoked. Target: \(targetURL)")
            self.deepLinkURL = targetURL
        }
    }
}