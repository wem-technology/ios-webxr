// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "test",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        // An xtool project should contain exactly one library product,
        // representing the main app.
        .library(
            name: "test",
            targets: ["test"]
        )
    ],
    targets: [
        .target(
            name: "test",
            resources: [
                // This tells Swift to bundle this file so it's accessible at runtime
                .process("iwer-bridge.js"),
                .process("iwer.min.js")
            ]
        )
    ]
)
