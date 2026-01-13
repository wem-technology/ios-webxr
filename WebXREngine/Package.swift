// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "WebXREngine",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "WebXREngine",
            targets: ["WebXREngine"]),
    ],
    targets: [
        .target(
            name: "WebXREngine",
            resources: [
                .process("Resources/webxr-polyfill.js")
            ]
        ),
    ]
)