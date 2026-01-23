#!/bin/bash

# ==============================================================================
# 🎨 White-Label Configuration
# Edit the values below to customize the build before generating the project.
# ==============================================================================

# App Identity
export APP_NAME="HelloXR"
export BUNDLE_ID="com.wemtechnology.helloxr"
export VERSION="1.3.0"
export BUILD_NUMBER="1"

# The domain used for Associated Domains (Universal Links / App Clips)
export DOMAIN_URL="helloxr.app"
# The default URL the WebView will load on launch
export START_URL="https://helloxr.app"

# Signing
# Enter your Apple Development Team ID (Found at developer.apple.com/account)
# e.g., "A1B2C3D4E5"
export DEVELOPMENT_TEAM="YOUR_TEAM_ID_HERE"

# Assets
# Place a 1024x1024 PNG in the root folder and reference it here.
# If this file is missing, the script will auto-download a placeholder.
export ICON_SOURCE="icon.png"

# ==============================================================================
# ⚙️  Generation Logic
# ==============================================================================

set -e

# Check if XcodeGen is installed
if ! command -v xcodegen &> /dev/null; then
    echo "❌ Error: xcodegen is not installed."
    echo "   Please run: brew install xcodegen"
    exit 1
fi

echo "🚀 Generating Xcode Project for: $APP_NAME"
echo "   Bundle ID: $BUNDLE_ID"
echo "   Start URL: $START_URL"

# Generate the project using the variables exported above
xcodegen generate

echo "✅ Project generated successfully!"
echo "📂 Opening $APP_NAME.xcodeproj..."

open "$APP_NAME.xcodeproj"