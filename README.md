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

1. **Install dependencies (one-time setup):**
   ```bash
   cd cli && npm install && cd ..
   ```

2. **Run the interactive CLI:**
   ```bash
   npx --prefix cli ios-webxr-cli
   ```
   
   The CLI will prompt you for all configuration values:
   - Project name (e.g., MyApp)
   - App display name (e.g., My App)
   - Bundle ID prefix (e.g., com.yourcompany.yourapp)
   - Main app bundle ID
   - App Clip bundle ID
   - Swift struct name
   - Start URL
   - Associated domain
   - Version and build number
   - iOS deployment target
   - Xcode version requirement
   - Target names (optional)

3. **Add your app icon (optional):**
   Place a `icon.png` file (1024x1024 pixels) in your project root directory. The CLI will automatically generate all required icon sizes for iOS.

4. **Generate your Xcode project:**
   ```bash
   cd MyApp
   xcodegen generate
   open MyApp.xcodeproj
   ```

**Using a config file (optional)**

If you prefer to use a config file instead of interactive prompts:

1. **Create a configuration file:**
   ```bash
   cp whitelabel.config.json myapp.config.json
   ```

2. **Edit `myapp.config.json`** with your values (see Configuration Reference below)

3. **Add your app icon (optional):**
   Place a `icon.png` file (1024x1024 pixels) in the template directory or output directory. The CLI will automatically generate all required icon sizes.

4. **Run with config file:**
   ```bash
   npx --prefix cli ios-webxr-cli -f myapp.config.json
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

- Node.js 16+ and npm (for whitelabel CLI tool)
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

The CLI tool creates a new project directory (doesn't modify the template), replacing `${variable}` placeholders with your values.

### Command Line Options

- `[config]` (positional): Path to configuration JSON file (optional - will prompt interactively if not provided)
- `-f, --config-file <path>`: Path to configuration JSON file (alternative to positional argument)
- `-o, --output <path>`: Output directory (default: inside template directory with project name)
- `-t, --template <path>`: Template directory (default: current directory)

**Examples:**
```bash
# Interactive mode (prompts for all values)
npx --prefix cli ios-webxr-cli

# Use custom config file
npx --prefix cli ios-webxr-cli -f myapp.config.json

# Custom output directory
npx --prefix cli ios-webxr-cli -o ../MyApp

# Custom template directory
npx --prefix cli ios-webxr-cli -t /path/to/template

# Combine options
npx --prefix cli ios-webxr-cli -f myapp.config.json -o ../MyApp
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

**`iconPath`** (optional)
- Custom path to the app icon file (1024x1024 PNG)
- Can be absolute path or relative to current working directory
- If not specified, defaults to `icon.png` in the output directory

## App Icon Generation

The CLI automatically generates all required iOS app icon sizes from a single source image.

### Setup

1. **Create your icon:**
   - Create a 1024x1024 pixel PNG image
   - You can either:
     - Place it as `icon.png` in your project root directory (same directory as your config file) - **default behavior**
     - Or specify a custom path using the `iconPath` option in your config file

2. **Specify custom icon path (optional):**
   Add `iconPath` to your config file:
   ```json
   {
     "iconPath": "/path/to/your/icon.png"
   }
   ```
   Or use a relative path:
   ```json
   {
     "iconPath": "../shared-assets/icon.png"
   }
   ```

3. **Generate icons:**
   When you run the CLI, it will automatically:
   - Detect `icon.png` in the output directory
   - Create `Sources/App/Assets.xcassets/AppIcon.appiconset/` structure
   - Generate all required icon sizes:
     - iPhone: 20pt, 29pt, 40pt, 60pt (@2x, @3x)
     - iPad: 20pt, 29pt, 40pt, 76pt, 83.5pt (@1x, @2x)
     - Marketing: 1024x1024

3. **Verify icons:**
   After generation, check:
   ```
   YourApp/Sources/App/Assets.xcassets/AppIcon.appiconset/
   ```
   You should see 17 icon files and a `Contents.json` file.

4. **View in Xcode:**
   After running `xcodegen generate`, open the project in Xcode and navigate to:
   - Your app target → `Assets.xcassets` → `AppIcon`
   - All icon slots should be populated

**Note:** 
- If the icon file is not found (either default `icon.png` or custom `iconPath`), the CLI will skip icon generation and show a warning. You can add icons manually later in Xcode.
- Using a custom `iconPath` prevents overwriting existing icons in the output directory, which is useful when generating multiple projects or keeping icons in a shared location.

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

**2. App Layer** (`Sources/App/`)
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
- **"Entitlements file was modified during the build"**: Ensure all `${variable}` placeholders are replaced. Regenerate the project if needed.

### App Clip Issues

- **App Clip card doesn't appear**: Check AASA file is accessible and has correct Team ID
- **Wrong Content-Type**: Ensure server returns `application/json`
- **Redirects**: AASA file must be directly accessible (no redirects)
- **HTTPS required**: Must use HTTPS, not HTTP

### App Icon Issues

- **Icons not appearing**: Ensure `icon.png` is in the project root directory before running the CLI
- **Missing icon sizes**: Regenerate icons by running the CLI again (it will overwrite existing icons)
- **Icons not showing in Xcode**: Regenerate the Xcode project with `xcodegen generate` after icon generation
- **Icon generation skipped**: The CLI requires macOS with `sips` command available. On other platforms, add icons manually in Xcode.

## Performance & Limitations

* **Frame Serialization:** Video frames are converted to Base64 strings, which incurs a performance cost
* **FPS Throttling:** Frame transmission is throttled to maintain UI responsiveness
* **Device Required:** AR features require a physical iOS device (not Simulator)

## Contributing

Pull requests and issue reporting are welcome. This project is intended as a starting point for developers requiring WebXR capabilities on iOS today.

## License

See [LICENSE](LICENSE) file for details.
