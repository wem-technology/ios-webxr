import SwiftUI

struct ContentView: View {
    @State private var urlString: String = AppConfig.startURL
    @State private var currentURL: URL? = URL(string: AppConfig.startURL)
    @State private var isARActive: Bool = false
    
    var body: some View {
        ZStack(alignment: .top) {
            // AR Web View Background (Always present, handles camera)
            if let targetURL = currentURL {
                ARWebView(url: targetURL, isARActive: $isARActive)
                    .edgesIgnoringSafeArea(.all)
            }
            
            // UI Overlay
            VStack {
                // 1. Address Bar (Hidden when AR is active)
                if !isARActive {
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
                    .transition(.move(edge: .top).combined(with: .opacity))
                }
                
                Spacer()
            }
            
            // 2. AR Exit Button (Visible ONLY when AR is active)
            if isARActive {
                VStack {
                    HStack {
                        Button(action: {
                            // Toggling this to false triggers ARWebView.updateUIView,
                            // which calls coordinator.stopSession()
                            withAnimation {
                                isARActive = false
                            }
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.title2)
                                Text("Exit AR")
                                    .fontWeight(.semibold)
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(.thinMaterial)
                            .foregroundColor(.primary)
                            .cornerRadius(20)
                            .shadow(radius: 4)
                        }
                        .padding(.leading)
                        .padding(.top, 50)
                        
                        Spacer()
                    }
                    Spacer()
                }
                .transition(.opacity)
            }
        }
        .statusBar(hidden: isARActive) // Hide status bar in AR mode
        .animation(.easeInOut, value: isARActive) // Animate UI changes
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