// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "WebXRKit",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "WebXRKit",
            targets: ["WebXRKit"]
        )
    ],
    targets: [
        .target(
            name: "WebXRKit",
            dependencies: [],
            resources: [
                .process("Resources/webxr-polyfill.js")
            ]
        )
    ]
)
