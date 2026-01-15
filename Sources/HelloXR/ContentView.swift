import SwiftUI
import VisionKit

struct ContentView: View {

    @Binding var externalLoadURL: URL?

    // Navigation State
    @State private var urlString: String = AppConfig.startURL
    @State private var navAction: WebViewNavigationAction = .load(URL(string: AppConfig.startURL)!)
    
    // Web State
    @State private var isARActive: Bool = false
    @State private var canGoBack: Bool = false
    @State private var canGoForward: Bool = false
    
    // UI State
    @State private var isNavExpanded: Bool = false
    
    // Scanner State
    @State private var isShowingScanner: Bool = false
    @State private var scannedTextResult: String?
    
    // Custom Color: #272727 (RGB 39, 39, 39)
    private let safeAreaColor = Color(red: 39/255, green: 39/255, blue: 39/255)
    
    var body: some View {
        ZStack(alignment: .top) {
            
            // 1. Background Color
            safeAreaColor
                .edgesIgnoringSafeArea(.all)
            
            // 2. Main Content
            ZStack(alignment: .top) {
                // AR Web View
                ARWebView(
                    action: $navAction,
                    isARActive: $isARActive,
                    currentURLString: $urlString,
                    canGoBack: $canGoBack,
                    canGoForward: $canGoForward
                )
                .edgesIgnoringSafeArea(isARActive ? [] : .all)
                
                // 3. UI Overlay
                if !isARActive {
                    VStack {
                        if isNavExpanded {
                            controlBar
                                .transition(.move(edge: .top).combined(with: .opacity))
                                .padding(.horizontal) // Keep padding for the bar
                        } else {
                            HStack {
                                Spacer()
                                navToggleButton
                                    .transition(.scale.combined(with: .opacity))
                            }
                            .padding(.trailing, 8)
                        }
                        Spacer()
                    }
                    .padding(.top, 20)
                }
                
                // 4. AR Exit Button
                if isARActive {
                    exitARButton
                        .transition(.opacity)
                }
            }
        }
        .statusBar(hidden: isARActive)
        .animation(.spring(), value: isNavExpanded)
        .animation(.easeInOut, value: isARActive)
        .onChange(of: externalLoadURL) { newURL in
            if let validURL = newURL {
                urlString = validURL.absoluteString
                navAction = .load(validURL)
            }
        }
        // Handle Scanned Text
        .onChange(of: scannedTextResult) { newValue in
            if let text = newValue {
                urlString = text
                processAndLoad()
                // Reset result so we can scan the same text again if needed
                scannedTextResult = nil
            }
        }
        // Present the Scanner
        .sheet(isPresented: $isShowingScanner) {
            if #available(iOS 16.0, *) {
                // We wrap this in a NavigationView so we can add a Cancel button
                NavigationView {
                    TextScannerView(scannedText: $scannedTextResult)
                        .navigationTitle("Tap text to load")
                        .navigationBarTitleDisplayMode(.inline)
                        .toolbar {
                            ToolbarItem(placement: .cancellationAction) {
                                Button("Cancel") {
                                    isShowingScanner = false
                                }
                            }
                        }
                }
            } else {
                Text("Scan-to-text requires iOS 16 or later")
            }
        }
    }
    
    var navToggleButton: some View {
        Button(action: {
            isNavExpanded = true
        }) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.primary)
                .frame(width: 44, height: 44)
                .background(.regularMaterial)
                .cornerRadius(12)
                .shadow(radius: 4)
        }
    }
    
    var controlBar: some View {
        HStack(spacing: 8) {
            Button(action: { navAction = .goBack }) {
                Image(systemName: "chevron.left")
                    .foregroundColor(canGoBack ? .primary : .secondary.opacity(0.5))
            }
            .disabled(!canGoBack)

            Button(action: { navAction = .goForward }) {
                Image(systemName: "chevron.right")
                    .foregroundColor(canGoForward ? .primary : .secondary.opacity(0.5))
            }
            .disabled(!canGoForward)
            
            HStack {
                if #available(iOS 16.0, *), DataScannerViewController.isSupported {
                    Button(action: {
                        isShowingScanner = true
                    }) {
                        Image(systemName: "text.viewfinder")
                            .foregroundColor(.blue)
                    }
                    .padding(.leading, 4)
                }

                TextField("Search or enter website", text: $urlString)
                    .keyboardType(.webSearch)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                    .foregroundColor(.black)
                    .submitLabel(.go)
                    .onSubmit {
                        processAndLoad()
                    }
                
                if !urlString.isEmpty {
                    Button(action: { urlString = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(8)
            .background(Color.white)
            .cornerRadius(8)
            
            // Go Button
            Button(action: {
                processAndLoad()
            }) {
                Text("Go")
                    .bold()
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
            
            // Close Navbar Button
            Button(action: {
                isNavExpanded = false
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.secondary)
                    .frame(width: 32, height: 32)
                    .background(Color.gray.opacity(0.2))
                    .clipShape(Circle())
            }
        }
        .padding(10)
        .background(.regularMaterial)
        .cornerRadius(16)
        .shadow(radius: 4)
    }
    
    var exitARButton: some View {
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
    }
    
    private func processAndLoad() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
        
        // Auto-collapse the navbar when loading
        isNavExpanded = false
        
        let rawInput = urlString.trimmingCharacters(in: .whitespacesAndNewlines)
        if rawInput.isEmpty { return }
        
        if rawInput.contains(" ") || !rawInput.contains(".") {
            if let query = rawInput.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
               let searchURL = URL(string: "https://www.google.com/search?q=\(query)") {
                navAction = .load(searchURL)
            }
        } else {
            var validURLString = rawInput
            if !validURLString.lowercased().hasPrefix("http") {
                validURLString = "https://" + validURLString
            }
            
            if let finalURL = URL(string: validURLString) {
                if case .load(let current) = navAction, current == finalURL {
                    navAction = .reload
                } else {
                    navAction = .load(finalURL)
                }
                urlString = validURLString
            }
        }
    }
}