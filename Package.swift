// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "HelloXR",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        // An xtool project should contain exactly one library product,
        // representing the main app.
        .library(
            name: "HelloXR",
            targets: ["HelloXR"]
        )
    ],
    dependencies: [
        .package(path: "./WebXRKit")
    ],
    targets: [
        .target(
            name: "HelloXR",
            dependencies: [
                .product(name: "WebXRKit", package: "WebXRKit")
            ]
        )
    ]
)
