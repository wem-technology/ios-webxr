#!/bin/bash
set -e

# Default to "icon.png" if the environment variable ICON_SOURCE isn't set
SOURCE_FILE="${ICON_SOURCE:-icon.png}"
APP_NAME="${APP_NAME:-HelloXR}"

# Define output location matches your project structure
ASSETS_DIR="Sources/WebXRApp/Assets.xcassets"
ICONSET_DIR="$ASSETS_DIR/AppIcon.appiconset"

echo "🎨 Generating Icons..."
echo "   Source: $SOURCE_FILE"
echo "   Destination: $ICONSET_DIR"

# 1. Check if source exists. If not, download a placeholder (White-label fallback)
if [ ! -f "$SOURCE_FILE" ]; then
    echo "⚠️  $SOURCE_FILE not found. Downloading placeholder for '$APP_NAME'..."
    # Ensure curl doesn't fail silently
    curl -f -L -o "$SOURCE_FILE" "https://dummyimage.com/1024x1024/007AFF/ffffff.jpg&text=$APP_NAME" || { echo "❌ Failed to download placeholder"; exit 1; }
fi

# 2. Ensure directories exist
mkdir -p "$ICONSET_DIR"

# 3. Create Contents.json
cat <<EOF > "$ICONSET_DIR/Contents.json"
{
  "images": [
    {"size":"20x20","idiom":"iphone","filename":"Icon-20@2x.png","scale":"2x"},
    {"size":"20x20","idiom":"iphone","filename":"Icon-20@3x.png","scale":"3x"},
    {"size":"29x29","idiom":"iphone","filename":"Icon-29@2x.png","scale":"2x"},
    {"size":"29x29","idiom":"iphone","filename":"Icon-29@3x.png","scale":"3x"},
    {"size":"40x40","idiom":"iphone","filename":"Icon-40@2x.png","scale":"2x"},
    {"size":"40x40","idiom":"iphone","filename":"Icon-40@3x.png","scale":"3x"},
    {"size":"60x60","idiom":"iphone","filename":"Icon-60@2x.png","scale":"2x"},
    {"size":"60x60","idiom":"iphone","filename":"Icon-60@3x.png","scale":"3x"},
    {"size":"20x20","idiom":"ipad","filename":"Icon-20.png","scale":"1x"},
    {"size":"20x20","idiom":"ipad","filename":"Icon-20@2x.png","scale":"2x"},
    {"size":"29x29","idiom":"ipad","filename":"Icon-29.png","scale":"1x"},
    {"size":"29x29","idiom":"ipad","filename":"Icon-29@2x.png","scale":"2x"},
    {"size":"40x40","idiom":"ipad","filename":"Icon-40.png","scale":"1x"},
    {"size":"40x40","idiom":"ipad","filename":"Icon-40@2x.png","scale":"2x"},
    {"size":"76x76","idiom":"ipad","filename":"Icon-76.png","scale":"1x"},
    {"size":"76x76","idiom":"ipad","filename":"Icon-76@2x.png","scale":"2x"},
    {"size":"83.5x83.5","idiom":"ipad","filename":"Icon-83.5@2x.png","scale":"2x"},
    {"size":"1024x1024","idiom":"ios-marketing","filename":"Icon-1024.png","scale":"1x"}
  ],
  "info": { "version": 1, "author": "xcode" }
}
EOF

# 4. Resize function using sips
function resize() {
    sips -z $1 $1 -s format png "$SOURCE_FILE" --out "$ICONSET_DIR/$2" > /dev/null 2>&1
}

# 5. Generate images
resize 40 "Icon-20@2x.png"
resize 60 "Icon-20@3x.png"
resize 58 "Icon-29@2x.png"
resize 87 "Icon-29@3x.png"
resize 80 "Icon-40@2x.png"
resize 120 "Icon-40@3x.png"
resize 120 "Icon-60@2x.png"
resize 180 "Icon-60@3x.png"
resize 20 "Icon-20.png"
resize 29 "Icon-29.png"
resize 40 "Icon-40.png"
resize 76 "Icon-76.png"
resize 152 "Icon-76@2x.png"
resize 167 "Icon-83.5@2x.png"
resize 1024 "Icon-1024.png"

echo "✅ Icons generated successfully."