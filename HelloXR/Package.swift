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
    targets: [
        .target(
            name: "HelloXR",
            resources: [
            ]
        )
    ]
)
