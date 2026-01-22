# iOS WebXR Browser

<img src="assets/demo.gif" width="250" alt="App Demo">

A native iOS app that enables WebXR support on iOS devices by bridging ARKit to WKWebView. Provides a pure WebView experience with no native UI overlays, allowing web content to fully control the experience including AR activation.

Built on **WebXRKit**, a reusable Swift Package that provides the WebXR polyfill engine. The app layer is minimal (~68 lines), serving as a thin wrapper around the engine.

## Key Features

* **WebXR Device API Support:** JavaScript polyfill mocks the WebXR API within the WebView
* **Camera Access:** Passes video frames from ARKit to the WebView for passthrough AR experiences
* **Hit Testing:** Bridges ARKit raycasting to WebXR hit-test requests for placing virtual objects
* **World Tracking:** Utilizes `ARWorldTrackingConfiguration` for 6DOF tracking
* **Pure WebView Experience:** No native UI overlays - web content controls everything
* **App Clip Support:** Supports iOS App Clips for instant AR experiences
* **White-Label Ready:** Generate customized projects with your own bundle IDs, names, and domains

## Quick Start

### Option 1: Generate White-Label Project (Recommended)

1. **Create a configuration file:**
   ```bash
   cp whitelabel.config.json myapp.config.json
   ```

2. **Edit `myapp.config.json`** with your values:
   ```json
   {
     "project": {
       "name": "MyApp",
       "displayName": "My Awesome App",
       "bundleIdPrefix": "com.mycompany.myapp",
       "version": "1.0.0",
       "buildNumber": "1"
     },
     "app": {
       "mainBundleId": "com.mycompany.myapp",
       "clipBundleId": "com.mycompany.myapp.Clip",
       "structName": "MyAppApp",
       "startURL": "https://myapp.com"
     },
     "domains": {
       "associatedDomain": "myapp.com"
     },
     "ios": {
       "deploymentTarget": "16.0",
       "xcodeVersion": "15.0"
     }
   }
   ```

3. **Generate your project:**
   ```bash
   python3 generate_whitelabel.py -f myapp.config.json
   cd MyApp
   xcodegen generate
   open MyApp.xcodeproj
   ```

### Option 2: Use Template Directly

1. **Install XcodeGen:**
   ```bash
   brew install xcodegen
   ```

2. **Generate Xcode project:**
   ```bash
   xcodegen generate
   open *.xcodeproj
   ```

3. **Build and run** on a physical iOS device (ARKit requires a real device)

## Prerequisites

- Xcode 14.0+ (15.0+ recommended)
- XcodeGen (for generating Xcode project)
- iOS Device with A9 chip or later (ARKit support required)
- **Note:** AR features will not function on the iOS Simulator

## Building & Running

### Using Xcode (Recommended)

1. Generate project: `xcodegen generate`
2. Open `.xcodeproj` in Xcode
3. Connect your iOS device
4. Select device as build target
5. Press `Cmd+R` to build and run

### Command Line

```bash
xcodegen generate
xcodebuild -resolvePackageDependencies -project ${projectName}.xcodeproj
xcodebuild -project ${projectName}.xcodeproj \
           -scheme HelloXR \
           -destination 'generic/platform=iOS' \
           clean build
```

### Using xtool

```bash
xcodegen generate
xtool dev
```

## White-Label Configuration

The generator creates a new project directory (doesn't modify the template), replacing `${variable}` placeholders with your values.

### Command Line Options

- `-f, --config-file`: Path to configuration JSON file
- `-o, --output`: Output directory (default: inside workspace with project name)
- `-t, --template`: Template directory (default: script directory)

**Examples:**
```bash
# Use default config
python3 generate_whitelabel.py

# Use custom config file
python3 generate_whitelabel.py -f myapp.config.json

# Custom output directory
python3 generate_whitelabel.py -f myapp.config.json -o ../MyApp
```

### Configuration Reference

**`project`**
- `name`: Project name (valid identifier, no spaces)
- `displayName`: App display name on iOS home screen
- `bundleIdPrefix`: Bundle ID prefix (e.g., `com.company.app`)
- `version`: Marketing version (e.g., `1.0.0`)
- `buildNumber`: Build number

**`app`**
- `mainBundleId`: Main app bundle identifier (must start with `bundleIdPrefix`)
- `clipBundleId`: App Clip bundle identifier (must end with `.Clip`)
- `structName`: Swift struct name for main App struct
- `startURL`: Initial URL to load (must start with `http://` or `https://`)
- `mainTargetName`: (optional) Xcode target name for main app
- `clipTargetName`: (optional) Xcode target name for App Clip

**`domains`**
- `associatedDomain`: Associated domain for App Clips (without `appclips:` prefix)

**`ios`**
- `deploymentTarget`: Minimum iOS version (e.g., `16.0`)
- `xcodeVersion`: Xcode version requirement (e.g., `15.0`)

## App Clip Setup

To enable App Clip invocation, you need to set up an Apple App Site Association (AASA) file on your web server.

### 1. Create AASA File

Create `https://yourdomain.com/.well-known/apple-app-site-association`:

```json
{
  "appclips": {
    "apps": [
      "TEAM_ID.YOUR_BUNDLE_ID.Clip"
    ]
  }
}
```

Replace:
- `TEAM_ID` with your Apple Developer Team ID (10-character alphanumeric)
- `YOUR_BUNDLE_ID` with your app's bundle identifier

### 2. Server Requirements

The AASA file must:
- Be served over HTTPS
- Have `Content-Type: application/json` header
- Be accessible without redirects (no 301/302)
- Return 200 status code

**Nginx:**
```nginx
location /.well-known/apple-app-site-association {
    default_type application/json;
    add_header Content-Type application/json;
}
```

**Vercel/Netlify:**
Create `public/.well-known/apple-app-site-association` with the JSON content.

### 3. Verify

```bash
curl https://yourdomain.com/.well-known/apple-app-site-association
```

Should return JSON with `Content-Type: application/json` header.

### 4. App Clip Invocation

Your App Clip will be invoked from URLs like:
```
https://yourdomain.com/?to=https://example.com/webxr-app
```

The app extracts the `?to=` parameter and loads the target URL in the WebView.

## Architecture

### Components

**1. WebXRKit Package** (`WebXRKit/`)
- Reusable Swift Package containing the WebXR engine
- `ARWebView` - SwiftUI view combining ARSCNView and WKWebView
- `ARWebCoordinator` - Manages ARSession and WebView communication
- `ARCameraFrameProcessor` - Processes ARFrame pixel buffers
- `webxr-polyfill.js` - JavaScript polyfill intercepting WebXR API calls

**2. App Layer** (`Sources/HelloXR/`)
- Minimal app-specific code (~68 lines)
- `App.swift` - App entry point and App Clip deep linking
- `ContentView.swift` - Wraps ARWebView (no UI overlays)
- `AppConfig.swift` - Configuration (start URL)

### Data Flow

1. Web content calls `navigator.xr.requestSession('immersive-ar')`
2. JavaScript polyfill intercepts and sends message to native Swift
3. `ARWebCoordinator` starts ARSession and begins frame processing
4. Camera frames are serialized to Base64 and sent to JavaScript
5. Tracking matrices (view, projection, camera transform) updated each frame
6. Hit testing bridges ARKit raycasting to WebXR API

## Using WebXRKit in Your Own Project

WebXRKit is a reusable Swift Package:

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

## Troubleshooting

### Project Not Found
```bash
xcodegen generate
```

### Package Not Found
1. In Xcode: `File` → `Packages` → `Reset Package Caches`
2. Then: `File` → `Packages` → `Resolve Package Versions`
3. Or regenerate: `xcodegen generate`

### Build Errors

- **"Cannot find type 'ARFrame'"**: Building for iOS, not macOS
- **"Module 'WebXRKit' not found"**: Regenerate project with `xcodegen generate`
- **"Unable to find module dependency"**: Run `xcodebuild -resolvePackageDependencies`

### App Clip Issues

- **App Clip card doesn't appear**: Check AASA file is accessible and has correct Team ID
- **Wrong Content-Type**: Ensure server returns `application/json`
- **Redirects**: AASA file must be directly accessible (no redirects)
- **HTTPS required**: Must use HTTPS, not HTTP

## Performance & Limitations

* **Frame Serialization:** Video frames are converted to Base64 strings, which incurs a performance cost
* **FPS Throttling:** Frame transmission is throttled to maintain UI responsiveness
* **Device Required:** AR features require a physical iOS device (not Simulator)

## Contributing

Pull requests and issue reporting are welcome. This project is intended as a starting point for developers requiring WebXR capabilities on iOS today.

## License

See [LICENSE](LICENSE) file for details.
