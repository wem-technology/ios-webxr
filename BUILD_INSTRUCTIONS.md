# Build & Test Instructions

## Prerequisites

- Xcode 14.0+ (15.0+ recommended)
- XcodeGen (for generating Xcode project)
- iOS Device with A9 chip or later (ARKit support required)
- **Note:** AR features will not function on the iOS Simulator

## Quick Start

1. **Install XcodeGen** (if not already installed):
   ```bash
   brew install xcodegen
   ```

2. **Generate Xcode Project**:
   ```bash
   xcodegen generate
   ```

3. **Open in Xcode**:
   ```bash
   open Cyango.xcodeproj
   ```

4. **Build & Run**:
   - Connect your iOS device
   - Select your device as the build target
   - Press `Cmd+R` to build and run

## Option 1: Using Xcode (Recommended)

### Setup

1. **Generate Xcode Project**:
   ```bash
   # Install XcodeGen if needed
   brew install xcodegen
   
   # Generate the Xcode project from project.yml
   xcodegen generate
   ```

2. **Open in Xcode**:
   ```bash
   open Cyango.xcodeproj
   ```

3. **Resolve Swift Package Dependencies**:
   - Xcode will automatically resolve WebXRKit package
   - If not, go to `File` → `Packages` → `Resolve Package Versions`
   - WebXRKit should appear in Project Navigator under "Package Dependencies"

### Build & Run

1. Connect your iOS device via USB
2. Select your device as the build target in Xcode
3. Press `Cmd+R` to build and run, or click the Play button

## Option 2: Using xtool (Development)

If you have `xtool` installed:

```bash
# Generate project first
xcodegen generate

# Build and run on connected device
xtool dev
```

**Note:** `xtool` requires the Xcode project to be generated first.

## Option 3: Command Line Build

```bash
# Generate project if needed
xcodegen generate

# Resolve package dependencies
xcodebuild -resolvePackageDependencies -project Cyango.xcodeproj

# Build for generic iOS device
xcodebuild -project Cyango.xcodeproj \
           -scheme HelloXR \
           -destination 'generic/platform=iOS' \
           clean build

# Or build for specific device
xcodebuild -project Cyango.xcodeproj \
           -scheme HelloXR \
           -destination 'platform=iOS,id=YOUR_DEVICE_ID' \
           build
```

**Note:** `Cyango.xcodeproj` is generated from `project.yml` and is ignored in git. Always regenerate it with `xcodegen generate` after cloning.

## Testing

### Manual Testing

1. **Launch the app** on a physical iOS device
2. **App loads** `https://story.cyango.com` automatically
3. **Web content controls everything** - no native UI overlays
4. **AR activates** when web content calls WebXR API
5. **Verify**:
   - AR session initializes automatically
   - Camera passthrough works
   - Virtual objects can be placed via hit testing
   - Full immersive experience (no UI overlays)

### Test URLs

The app loads `https://story.cyango.com` by default. For testing WebXR, ensure your web content:
- Calls `navigator.xr.requestSession('immersive-ar')`
- Uses WebXR API for AR features

Example WebXR demos:
- `https://threejs.org/examples/webxr_ar_cones.html`
- `https://immersiveweb.dev/`

## Troubleshooting

### Project Not Found

If `Cyango.xcodeproj` doesn't exist:
```bash
xcodegen generate
```

### Package Not Found

If Xcode can't find WebXRKit:
1. In Xcode: `File` → `Packages` → `Reset Package Caches`
2. Then: `File` → `Packages` → `Resolve Package Versions`
3. Or regenerate project: `xcodegen generate`
4. Or delete `DerivedData` and rebuild

### Build Errors

- **"Cannot find type 'ARFrame'"**: Make sure you're building for iOS, not macOS
- **"Module 'WebXRKit' not found"**: Regenerate the Xcode project with `xcodegen generate`
- **"Unable to find module dependency: 'WebXRKit'"**: Resolve packages in Xcode or run `xcodebuild -resolvePackageDependencies`
- **Resource bundle issues**: Ensure `webxr-polyfill.js` is in `WebXRKit/Sources/WebXRKit/Resources/`

### Verify Package Structure

```bash
# Check WebXRKit structure
ls -la WebXRKit/Sources/WebXRKit/
# Should show: ARWebCoordinator.swift, ARCameraFrameProcessor.swift, ARWebView.swift, WebXRKit.swift, Resources/

# Check resource file
ls -la WebXRKit/Sources/WebXRKit/Resources/
# Should show: webxr-polyfill.js
```

## Architecture

The app is split into two components:

1. **WebXRKit Package** (`WebXRKit/`):
   - Reusable WebXR engine
   - Contains ARWebView, ARWebCoordinator, etc.
   - Can be used in other projects

2. **App Layer** (`Sources/HelloXR/`):
   - Minimal app-specific code (~68 lines total)
   - App entry point and configuration
   - Uses WebXRKit as a dependency

## Development Workflow

1. **After cloning**:
   ```bash
   xcodegen generate
   open Cyango.xcodeproj
   ```

2. **Making changes**:
   - Edit `project.yml` for project settings
   - Edit `Sources/HelloXR/` for app code
   - Edit `WebXRKit/` for engine changes
   - Regenerate: `xcodegen generate`

3. **Building**:
   - Use Xcode (recommended)
   - Or command line: `xcodebuild -project Cyango.xcodeproj -scheme HelloXR`
