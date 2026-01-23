# iOS WebXR Polyfill App

<img src="assets/demo.gif" width="250" alt="App Demo">

## Links

Open this in Safari for the App Clip experience: [HelloXR page](https://helloxr.app)

Or download the full app here: [HelloXR app](https://apps.apple.com/us/app/helloxr/id6757726359)

## Overview

This application serves as a native shell to enable WebXR support on iOS devices, addressing the current lack of native support in mobile Safari. It bridges native ARKit tracking and camera data into a `WKWebView`, allowing standard WebXR applications (such as Three.js or React Three Fiber) to run with AR features enabled.

This project builds upon the logic of Mozilla's ARKit-WebXR polyfill, modernized for current iOS versions and wrapped in a SwiftUI interface.

## Key Features

* **WebXR Device API Support:** Injects a JavaScript polyfill to mock the WebXR API within the WebView.
* **Camera Access:** Passes video frames from ARKit to the WebView, enabling passthrough AR experiences.
* **Hit Testing:** Bridges ARKit raycasting to WebXR hit-test requests for placing virtual objects on real-world surfaces.
* **World Tracking:** Utilizes `ARWorldTrackingConfiguration` for 6DOF tracking.
* **Debug Tools:** Includes Eruda automatic injection for on-device JavaScript console debugging.

## Architecture

The application functions as a bridge between Swift (ARKit) and JavaScript (WebGL/WebXR):

1.  **Native Layer:** `ARWebCoordinator` manages an `ARSession`. It captures camera frames, handles world tracking, and performs raycasting.
2.  **Communication Bridge:** Data is passed to the `WKWebView` via `evaluateJavaScript` and received via `WKScriptMessageHandler`.
3.  **Polyfill Layer:** A custom JavaScript polyfill intercepts WebXR requests and routes them to the native Swift layer. Video frames are serialized to Base64 (sRGB) and sent to the JS context for rendering as a background texture.

## Installation

### Prerequisites

* Xcode 14.0+
* iOS Device with A9 chip or later (ARKit support required).
* *Note: AR features will not function on the iOS Simulator.*

### Testing with xtool

1.  Clone the repository.
2.  Build and test on a connected device using `xtool dev` [xtool](https://github.com/xtool-org/xtool).

### Building with XCode

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ios-webxr
   ```

2. **White-label:**
   Edit `generate_xcode_project.sh` and create an icon.png with your own brand and company info

3. **Generate and open Xcode project:**
   ```bash
   ./generate_xcode_project.sh
   ```

4. **Build and run:**
   - Connect your iOS device
   - Select your device as build target
   - Press `Cmd+R` to build and run

## Using WebXRKit in Your Own Project

WebXRKit is a reusable Swift Package. To use it in your own project:

### Swift Package Manager

Add to your `Package.swift`:
```swift
dependencies: [
    .package(path: "./WebXRKit")
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

## Usage

1.  Launch the app.
2.  Enter the URL of a WebXR-compatible page (e.g., Three.js AR examples).
3.  Tap "Start AR" within the web experience.
4.  The native UI will hide, and the AR session will initialize.
5.  Use the "Exit AR" button to tear down the session and return to the standard browser view.

## Performance & Limitations

* **Frame Serialization:** Video frames are currently converted to Base64 strings to pass them to the WebView. This incurs a performance cost.
* **FPS Throttling:** Frame transmission is throttled to maintain UI responsiveness.

## Contributing

Pull requests and issue reporting are welcome. This project is intended as a starting point for developers requiring WebXR capabilities on iOS today.

## Used By

[Brrrowser](https://apps.apple.com/us/app/brrrowser/id6747417026)
