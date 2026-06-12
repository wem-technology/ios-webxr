import Foundation

/// JavaScript that overrides navigator.geolocation to bridge to the native
/// GeolocationHandler. Injected as a WKUserScript at document start.
enum GeolocationShim {
    static let source = """
    (function () {
        "use strict";

        let watchIdCounter = 1;
        const pendingOneShot = {};
        const activeWatches = {};

        function makePosition(data) {
            return {
                coords: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    altitude: data.altitude,
                    accuracy: data.accuracy,
                    altitudeAccuracy: data.altitudeAccuracy,
                    heading: data.heading,
                    speed: data.speed,
                },
                timestamp: data.timestamp,
            };
        }

        function makeError(data) {
            return {
                code: data.code,
                message: data.message,
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
            };
        }

        window.__geolocationSuccess = function (requestId, data) {
            const position = makePosition(data);
            if (pendingOneShot[requestId]) {
                pendingOneShot[requestId].success(position);
                delete pendingOneShot[requestId];
            } else if (activeWatches[requestId]) {
                activeWatches[requestId].success(position);
            }
        };

        window.__geolocationError = function (requestId, data) {
            const error = makeError(data);
            if (pendingOneShot[requestId]) {
                if (pendingOneShot[requestId].error) {
                    pendingOneShot[requestId].error(error);
                }
                delete pendingOneShot[requestId];
            } else if (activeWatches[requestId]) {
                if (activeWatches[requestId].error) {
                    activeWatches[requestId].error(error);
                }
            }
        };

        const geolocation = {
            getCurrentPosition: function (success, error, options) {
                const requestId = "geo_" + watchIdCounter++;
                pendingOneShot[requestId] = { success: success, error: error };
                window.webkit.messageHandlers.geolocation.postMessage({
                    action: "getCurrentPosition",
                    requestId: requestId,
                    options: options || {},
                });
            },

            watchPosition: function (success, error, options) {
                const watchId = watchIdCounter++;
                const requestId = "geo_" + watchId;
                activeWatches[requestId] = { success: success, error: error };
                window.webkit.messageHandlers.geolocation.postMessage({
                    action: "watchPosition",
                    requestId: requestId,
                    options: options || {},
                });
                return watchId;
            },

            clearWatch: function (watchId) {
                const requestId = "geo_" + watchId;
                delete activeWatches[requestId];
                window.webkit.messageHandlers.geolocation.postMessage({
                    action: "clearWatch",
                    requestId: requestId,
                });
            },
        };

        Object.defineProperty(navigator, "geolocation", {
            value: geolocation,
            configurable: true,
            writable: false,
        });
    })();
    """
}
