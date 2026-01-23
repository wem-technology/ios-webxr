// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "WebXRApp",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "WebXRApp",
            targets: ["WebXRApp"]
        )
    ],
    dependencies: [
        .package(path: "./WebXRKit")
    ],
    targets: [
        .target(
            name: "WebXRApp",
            dependencies: [
                .product(name: "WebXRKit", package: "WebXRKit")
            ],
            path: "Sources/WebXRApp"
        )
    ]
)
