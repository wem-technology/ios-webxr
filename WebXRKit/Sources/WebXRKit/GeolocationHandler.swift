import CoreLocation
import Foundation
import WebKit

/// Bridges the W3C Geolocation API (overridden in geolocation-shim.js) to
/// CLLocationManager, which triggers the real system permission prompt.
@MainActor
class GeolocationHandler: NSObject, WKScriptMessageHandler {
    weak var webView: WKWebView?

    private let locationManager = CLLocationManager()

    // Request IDs waiting on a single position fix.
    private var oneShotRequests: Set<String> = []
    // Request IDs that want continuous updates.
    private var watchRequests: Set<String> = []

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }

    func userContentController(
        _ userContentController: WKUserContentController, didReceive message: WKScriptMessage
    ) {
        guard let body = message.body as? [String: Any],
            let action = body["action"] as? String
        else { return }

        switch action {
        case "getCurrentPosition":
            guard let requestId = body["requestId"] as? String else { return }
            oneShotRequests.insert(requestId)
            requestLocation()

        case "watchPosition":
            guard let requestId = body["requestId"] as? String else { return }
            watchRequests.insert(requestId)
            ensureAuthorizedThenStart()

        case "clearWatch":
            guard let requestId = body["requestId"] as? String else { return }
            watchRequests.remove(requestId)
            stopUpdatingIfIdle()

        default: break
        }
    }

    private func requestLocation() {
        switch locationManager.authorizationStatus {
        case .notDetermined:
            // The delegate callback resumes pending requests once granted.
            locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            locationManager.requestLocation()
            startUpdatingIfNeeded()
        case .denied, .restricted:
            failAll(code: 1, message: "User denied geolocation access.")
        @unknown default:
            failAll(code: 2, message: "Location unavailable.")
        }
    }

    private func ensureAuthorizedThenStart() {
        switch locationManager.authorizationStatus {
        case .notDetermined:
            // The delegate callback starts updates once granted.
            locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            startUpdatingIfNeeded()
        case .denied, .restricted:
            failAll(code: 1, message: "User denied geolocation access.")
        @unknown default:
            failAll(code: 2, message: "Location unavailable.")
        }
    }

    private func startUpdatingIfNeeded() {
        guard !watchRequests.isEmpty else { return }
        let status = locationManager.authorizationStatus
        if status == .authorizedWhenInUse || status == .authorizedAlways {
            locationManager.startUpdatingLocation()
        }
    }

    private func stopUpdatingIfIdle() {
        if watchRequests.isEmpty {
            locationManager.stopUpdatingLocation()
        }
    }

}

// MARK: - CLLocationManagerDelegate

extension GeolocationHandler: @preconcurrency CLLocationManagerDelegate {
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedWhenInUse, .authorizedAlways:
            if !oneShotRequests.isEmpty {
                locationManager.requestLocation()
            }
            startUpdatingIfNeeded()
        case .denied, .restricted:
            failAll(code: 1, message: "User denied geolocation access.")
        case .notDetermined:
            break
        @unknown default:
            break
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }

        let data: [String: Any] = [
            "latitude": location.coordinate.latitude,
            "longitude": location.coordinate.longitude,
            "altitude": location.altitude,
            "accuracy": location.horizontalAccuracy,
            "altitudeAccuracy": location.verticalAccuracy,
            "heading": location.course >= 0 ? location.course : NSNull(),
            "speed": location.speed >= 0 ? location.speed : NSNull(),
            "timestamp": location.timestamp.timeIntervalSince1970 * 1000,
        ]

        let oneShots = oneShotRequests
        oneShotRequests.removeAll()
        for requestId in oneShots {
            deliverSuccess(requestId: requestId, data: data)
        }
        for requestId in watchRequests {
            deliverSuccess(requestId: requestId, data: data)
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        failAll(code: 2, message: error.localizedDescription)
    }

    // MARK: - JS Delivery

    private func deliverSuccess(requestId: String, data: [String: Any]) {
        guard let webView = webView,
            let jsonData = try? JSONSerialization.data(withJSONObject: data),
            let jsonString = String(data: jsonData, encoding: .utf8)
        else { return }

        webView.evaluateJavaScript("window.__geolocationSuccess('\(requestId)', \(jsonString))")
    }

    private func failAll(code: Int, message: String) {
        let data: [String: Any] = ["code": code, "message": message]
        guard let webView = webView,
            let jsonData = try? JSONSerialization.data(withJSONObject: data),
            let jsonString = String(data: jsonData, encoding: .utf8)
        else { return }

        let pending = oneShotRequests.union(watchRequests)
        oneShotRequests.removeAll()
        watchRequests.removeAll()
        for requestId in pending {
            webView.evaluateJavaScript("window.__geolocationError('\(requestId)', \(jsonString))")
        }
    }
}
