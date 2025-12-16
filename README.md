### iOS WebXR Polyfill App


<img src="assets/demo.gif" width="250" title="hover text">


I was frustrated by Apple's continued (frankly ridiculous) lack of support for mobile WebXR on iOS. Open-source solutions were out-of-date and closed commercial solutions either didn't work or didn't provide the `camera-access` feature.

This is a mostly vibe-coded iOS WebXR polyfill app, which builds on Mozilla's ARKit-WebXR polyfill code. I'm not a native dev so this is more of a starting point than a full-fledged solution.  I'm hoping this could be useful for others that would like to develop WebXR experiences for iOS.

Effectively this works by bridging the native ARKit API over to a mocked WebXR API in a WKWebView. I've tested R3F XR on my iPhone 13 Mini on iOS 18.6.2 and it works.

Built and tested using `xtool`: https://github.com/xtool-org/xtool

Open to PRs and issues
