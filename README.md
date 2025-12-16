### iOS WebXR Polyfill App

I was frustrated by Apple's continued (frankly ridiculous) lack of support for mobile WebXR on iOS. Open-source solutions were out-of-date and closed commercial solutions either didn't work or didn't provide the `camera-access` feature. This is a mostly vibe-coded iOS WebXR polyfill app, which builds on Mozilla's ARKit-WebXR polyfill code.

Effectively this works by bridging the native ARKit API over to a mocked WebXR API in a WKWebView. I've tested React Three Fiber XR and it works. I'm hoping this could be useful for others that would like to develop WebXR experiences for iOS.

Built and tested using `xtool`: https://github.com/xtool-org/xtool
