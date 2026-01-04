// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "xrshell",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        // An xtool project should contain exactly one library product,
        // representing the main app.
        .library(
            name: "xrshell",
            targets: ["xrshell"]
        )
    ],
    targets: [
        .target(
            name: "xrshell",
            resources: [
                // This tells Swift to bundle this file so it's accessible at runtime
                .process("webxr-polyfill.js")
            ]
        )
    ]
)
