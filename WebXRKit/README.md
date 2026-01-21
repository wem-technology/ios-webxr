# WebXRKit

A Swift Package that enables WebXR support on iOS devices by bridging ARKit to WKWebView. This package provides a SwiftUI view component that injects a JavaScript polyfill to enable WebXR API support in web applications.

## Overview

WebXRKit bridges native ARKit tracking and camera data into a `WKWebView`, allowing standard WebXR applications (such as Three.js or React Three Fiber) to run with AR features enabled on iOS devices.

## Features

- **WebXR Device API Support:** Injects a JavaScript polyfill to mock the WebXR API within the WebView
- **Camera Access:** Passes video frames from ARKit to the WebView, enabling passthrough AR experiences
- **Hit Testing:** Bridges ARKit raycasting to WebXR hit-test requests for placing virtual objects on real-world surfaces
- **World Tracking:** Utilizes `ARWorldTrackingConfiguration` for 6DOF tracking
- **SwiftUI Integration:** Provides a ready-to-use SwiftUI view component

## Requirements

- iOS 16.0+
- Xcode 14.0+
- iOS Device with A9 chip or later (ARKit support required)
- *Note: AR features will not function on the iOS Simulator*

## Installation

### Swift Package Manager

Add WebXRKit as a dependency in your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/your-org/WebXRKit.git", from: "1.0.0")
]
```

Or for local development:

```swift
dependencies: [
    .package(path: "../WebXRKit")
]
```

## Usage

### Basic Example

```swift
import SwiftUI
import WebXRKit

struct ContentView: View {
    @State private var urlString: String = "https://example.com/webxr-app"
    @State private var navAction: WebViewNavigationAction = .idle
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
    }
}
```

### Navigation Control

Use `WebViewNavigationAction` to control the WebView:

```swift
// Load a URL
navAction = .load(URL(string: "https://example.com")!)

// Navigate back/forward
navAction = .goBack
navAction = .goForward

// Reload current page
navAction = .reload
```

## Architecture

The package consists of:

1. **ARWebView:** SwiftUI view wrapper that combines ARSCNView and WKWebView
2. **ARWebCoordinator:** Manages ARSession and handles communication between Swift and JavaScript
3. **ARCameraFrameProcessor:** Processes ARFrame pixel buffers into Base64 JPEG strings
4. **webxr-polyfill.js:** JavaScript polyfill that intercepts WebXR API calls

## Performance & Limitations

- **Frame Serialization:** Video frames are currently converted to Base64 strings to pass them to the WebView. This incurs a performance cost.
- **FPS Throttling:** Frame transmission is throttled to maintain UI responsiveness.

## License

See LICENSE file for details.
