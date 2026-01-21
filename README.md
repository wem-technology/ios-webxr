# iOS WebXR Browser

<img src="assets/demo.gif" width="250" alt="App Demo">

## Overview

This is a native iOS app that enables WebXR support on iOS devices by bridging ARKit to WKWebView. It provides a pure WebView experience with no native UI overlays, allowing web content to fully control the experience including AR activation.

The app is built on **WebXRKit**, a reusable Swift Package that provides the WebXR polyfill engine. The app layer is minimal (~68 lines), serving as a thin wrapper around the engine.

## Key Features

* **WebXR Device API Support:** Injects a JavaScript polyfill to mock the WebXR API within the WebView
* **Camera Access:** Passes video frames from ARKit to the WebView, enabling passthrough AR experiences
* **Hit Testing:** Bridges ARKit raycasting to WebXR hit-test requests for placing virtual objects on real-world surfaces
* **World Tracking:** Utilizes `ARWorldTrackingConfiguration` for 6DOF tracking
* **Pure WebView Experience:** No native UI overlays - web content controls everything
* **App Clip Support:** Supports iOS App Clips for instant AR experiences

## Architecture

The project is split into two components:

### 1. WebXRKit Package (`WebXRKit/`)
A reusable Swift Package containing the WebXR engine:
- `ARWebView` - SwiftUI view that combines ARSCNView and WKWebView
- `ARWebCoordinator` - Manages ARSession and WebView communication
- `ARCameraFrameProcessor` - Processes ARFrame pixel buffers
- `webxr-polyfill.js` - JavaScript polyfill that intercepts WebXR API calls

### 2. App Layer (`Sources/HelloXR/`)
Minimal app-specific code (~68 lines):
- `App.swift` - App entry point and App Clip deep linking
- `ContentView.swift` - Wraps ARWebView (no UI overlays)
- `AppConfig.swift` - Configuration (start URL)

**Data Flow:**
1. Web content calls `navigator.xr.requestSession('immersive-ar')`
2. JavaScript polyfill intercepts and sends message to native Swift
3. `ARWebCoordinator` starts ARSession and begins frame processing
4. Camera frames are serialized to Base64 and sent to JavaScript
5. Tracking matrices (view, projection, camera transform) updated each frame
6. Hit testing bridges ARKit raycasting to WebXR API

## Installation

### Prerequisites

* Xcode 14.0+ (15.0+ recommended)
* XcodeGen (for generating Xcode project)
* iOS Device with A9 chip or later (ARKit support required)
* **Note:** AR features will not function on the iOS Simulator

### Building

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ios-webxr
   ```

2. **Install XcodeGen:**
   ```bash
   brew install xcodegen
   ```

3. **Generate Xcode project:**
   ```bash
   xcodegen generate
   ```

4. **Open in Xcode:**
   ```bash
   open *.xcodeproj
   ```

5. **Build and run:**
   - Connect your iOS device
   - Select your device as build target
   - Press `Cmd+R` to build and run

See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for detailed build instructions.

## Usage

1. **Launch the app** - It automatically loads the configured start URL
2. **Web content controls everything** - No native UI overlays
3. **AR activates automatically** - When web content calls WebXR API
4. **Full immersive experience** - Status bar hidden, edge-to-edge display

The app is a pure WebView container. All navigation, UI, and AR activation is handled by your web content.

## Project Structure

```
ios-webxr/
├── project.yml              # XcodeGen project definition (source of truth)
├── Package.swift            # Swift Package Manager manifest
├── Sources/
│   └── HelloXR/             # App-specific code (minimal)
│       ├── App.swift         # App entry point
│       ├── ContentView.swift # Main view (wraps ARWebView)
│       └── AppConfig.swift   # Configuration (start URL)
├── WebXRKit/                # WebXR engine package
│   ├── Package.swift
│   └── Sources/WebXRKit/
│       ├── ARWebView.swift
│       ├── ARWebCoordinator.swift
│       ├── ARCameraFrameProcessor.swift
│       └── Resources/
│           └── webxr-polyfill.js
└── *.xcodeproj/             # Generated (ignored in git)
```

**Note:** The `.xcodeproj` is generated from `project.yml` and is ignored in git. Always regenerate it with `xcodegen generate` after cloning.

## Using WebXRKit in Your Own Project

WebXRKit is a reusable Swift Package. To use it in your own project:

### Swift Package Manager

Add to your `Package.swift`:
```swift
dependencies: [
    .package(path: "./WebXRKit")  // or git URL
]
```

Then import and use:
```swift
import WebXRKit

ARWebView(
    action: $navAction,
    isARActive: $isARActive,
    currentURLString: $urlString,
    canGoBack: $canGoBack,
    canGoForward: $canGoForward
)
```

See [WebXRKit/README.md](WebXRKit/README.md) for detailed usage.

## Performance & Limitations

* **Frame Serialization:** Video frames are currently converted to Base64 strings to pass them to the WebView. This incurs a performance cost.
* **FPS Throttling:** Frame transmission is throttled to maintain UI responsiveness.

## Contributing

Pull requests and issue reporting are welcome. This project is intended as a starting point for developers requiring WebXR capabilities on iOS today.

## License

See [LICENSE](LICENSE) file for details.
