import SwiftUI

struct ContentView: View {
    // Default starting URL
    @State private var urlString: String = "https://pmndrs.github.io/xr/examples/stage/"
    // The URL actually being displayed by the AR view
    @State private var currentURL: URL? = URL(string: "https://pmndrs.github.io/xr/examples/stage/")
    
    var body: some View {
        ZStack(alignment: .top) {
            // AR Web View Background
            if let targetURL = currentURL {
                ARWebView(url: targetURL)
                    .edgesIgnoringSafeArea(.all)
            }
            
            // Address Bar Overlay
            VStack {
                HStack(spacing: 8) {
                    Image(systemName: "globe")
                        .foregroundColor(.secondary)
                    
                    TextField("https://...", text: $urlString)
                        .keyboardType(.URL)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .submitLabel(.go)
                        .onSubmit {
                            loadURL()
                        }
                    
                    Button(action: {
                        loadURL()
                    }) {
                        Text("Go")
                            .bold()
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(8)
                    }
                }
                .padding()
                .background(.regularMaterial) // Glassy background
                .cornerRadius(16)
                .padding(.horizontal)
                // Add top padding to account for safe area (Dynamic Island/Notch)
                .padding(.top, 50)
                
                Spacer()
            }
        }
        .statusBar(hidden: true)
    }
    
    private func loadURL() {
        // Dismiss keyboard
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
        
        var cleanString = urlString.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Basic convenience: Add https if missing
        if !cleanString.lowercased().hasPrefix("http") {
            cleanString = "https://" + cleanString
            urlString = cleanString // Update UI
        }
        
        if let newURL = URL(string: cleanString) {
            currentURL = newURL
        }
    }
}