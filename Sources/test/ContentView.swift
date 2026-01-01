import SwiftUI

struct ContentView: View {
    @State private var urlString: String = AppConfig.startURL
    @State private var currentURL: URL? = URL(string: AppConfig.startURL)
    @State private var isARActive: Bool = false
    
    var body: some View {
        ZStack(alignment: .top) {
            // 1. AR Web View (Background)
            if let targetURL = currentURL {
                ARWebView(url: targetURL, isARActive: $isARActive)
                    .edgesIgnoringSafeArea(.all)
            }
            
            // 2. Address Bar (Hidden in AR)
            if !isARActive {
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
                    .background(.regularMaterial)
                    .cornerRadius(16)
                    .padding(.horizontal)
                    .padding(.top, 50)
                    .shadow(radius: 5)
                    
                    Spacer()
                }
                .transition(.move(edge: .top).combined(with: .opacity))
            }
            
            // 3. Exit AR Button
            if isARActive {
                VStack {
                    HStack {
                        Button(action: {
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
                            .foregroundColor(.white)
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
        .statusBar(hidden: isARActive)
        .animation(.easeInOut, value: isARActive)
    }
    
    private func loadURL() {
        // Dismiss keyboard
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
        
        var cleanString = urlString.trimmingCharacters(in: .whitespacesAndNewlines)
        if !cleanString.isEmpty {
            if !cleanString.lowercased().hasPrefix("http") {
                cleanString = "https://" + cleanString
                urlString = cleanString
            }
            
            if let newURL = URL(string: cleanString) {
                currentURL = newURL
            }
        }
    }
}