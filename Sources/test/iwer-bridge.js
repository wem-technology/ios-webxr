/**
 * iwer-bridge.js
 * Bridges iOS ARKit to IWER.
 *
 * NOTE: This script assumes 'iwer.min.js' has been concatenated ABOVE it
 * in the same execution context by Swift.
 */

(function () {
    console.log("[IWER-Bridge] Initializing...");

    if (typeof IWER === 'undefined') {
        console.error("[IWER-Bridge] CRITICAL: IWER symbol is missing. Injection failed or order is wrong.");
        return;
    }

    const { XRDevice, XRSystem } = IWER;

    // --- Native Bridge Helper ---
    const createGlobalCallback = (fn) => {
        const name = `arkit_cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        window[name] = (data) => {
            const result = (typeof data === 'string') ? JSON.parse(data) : data;
            fn(result);
            delete window[name];
        };
        return name;
    };

    // --- Hit Test Manager ---
    class HitTestManager {
        constructor() {
            this.activeSources = new Set();
            this.latestResults = new Map();
        }

        addSource(source) {
            this.activeSources.add(source);
            this.latestResults.set(source, []);
        }

        removeSource(source) {
            this.activeSources.delete(source);
            this.latestResults.delete(source);
        }

        getResults(source) {
            return this.latestResults.get(source) || [];
        }

        update() {
            this.activeSources.forEach(source => {
                if (source.session && source.session.ended) {
                    this.removeSource(source);
                    return;
                }

                // Send Raycast Request to Swift (Center of screen)
                const callbackName = createGlobalCallback((results) => {
                    this.processNativeHitResults(source, results);
                });

                if (window.webkit && window.webkit.messageHandlers.hitTest) {
                    window.webkit.messageHandlers.hitTest.postMessage({
                        x: 0.5,
                        y: 0.5,
                        callback: callbackName
                    });
                }
            });
        }

        processNativeHitResults(source, nativeHits) {
            // Map to array of matrices (Float32Array) as expected by IWER XRDevice
            const formattedResults = nativeHits.map(hit => new Float32Array(hit.world_transform));
            this.latestResults.set(source, formattedResults);
        }
    }

    const hitTestManager = new HitTestManager();

    // --- ARKit IWER Device ---
    class ARKitIWERDevice extends XRDevice {
        constructor() {
            // Config matching IWER interface
            const config = {
                name: "ARKit IWER Bridge",
                controllerConfig: undefined,
                supportedSessionModes: ['inline', 'immersive-ar'],
                supportedFeatures: [
                    'viewer', 'local', 'local-floor', 'bounded-floor', 'unbounded',
                    'dom-overlay', 'anchors', 'hit-test'
                ],
                supportedFrameRates: [60],
                isSystemKeyboardSupported: false,
                internalNominalFrameRate: 60,
                environmentBlendModes: {
                    'immersive-ar': 'alpha-blend',
                    'inline': 'opaque'
                },
                interactionMode: "screen",
                userAgent: navigator.userAgent
            };

            super(config);

            this.ipd = 0;
            this.stereoEnabled = false;
            this.fovy = (60 * Math.PI) / 180;
            this._isARSessionActive = false;

            this.onARData = this.onARData.bind(this);
        }

        requestSession(mode, options) {
            return new Promise((resolve, reject) => {
                if (mode === 'immersive-ar') {
                    const callbackName = createGlobalCallback((response) => {
                        if (response.webXRAccess) {
                            this._isARSessionActive = true;
                            super.requestSession(mode, options).then(session => {
                                this.setupSessionOverrides(session);
                                resolve(session);
                            }).catch(reject);
                        } else {
                            reject(new DOMException("AR Session permission denied", "NotSupportedError"));
                        }
                    });

                    if (window.webkit && window.webkit.messageHandlers.requestSession) {
                        window.webkit.messageHandlers.requestSession.postMessage({
                            options: { worldSensing: true, alignEUS: true },
                            data_callback: "window.bridge_onARData",
                            callback: callbackName
                        });
                    } else {
                        reject(new DOMException("Native ARKit bridge not found", "NotSupportedError"));
                    }
                } else {
                    super.requestSession(mode, options).then(resolve).catch(reject);
                }
            });
        }

        onFrameStart(frame) {
            if (this._isARSessionActive) {
                hitTestManager.update();
            }
            super.onFrameStart(frame);
        }

        getHitTestResults(hitTestSource) {
            return hitTestManager.getResults(hitTestSource);
        }

        setupSessionOverrides(session) {
            const originalRequestHitTestSource = session.requestHitTestSource.bind(session);
            session.requestHitTestSource = (options) => {
                return originalRequestHitTestSource(options).then(source => {
                    hitTestManager.addSource(source);
                    const originalCancel = source.cancel.bind(source);
                    source.cancel = () => {
                        hitTestManager.removeSource(source);
                        originalCancel();
                    };
                    return source;
                });
            };

            session.addEventListener('end', () => {
                this._isARSessionActive = false;
                if (window.webkit && window.webkit.messageHandlers.stopAR) {
                    window.webkit.messageHandlers.stopAR.postMessage({});
                }
            });
        }

        onARData(jsonString) {
            if (!this._isARSessionActive) return;

            let data;
            try {
                data = (typeof jsonString === 'string') ? JSON.parse(jsonString) : jsonString;
            } catch (e) {
                console.error("Malformed AR data", e);
                return;
            }

            if (data.camera_transform) {
                const m = data.camera_transform;
                const x = m[12];
                const y = m[13];
                const z = m[14];

                const trace = m[0] + m[5] + m[10];
                let S = 0;
                let qw, qx, qy, qz;

                if (trace > 0) {
                    S = Math.sqrt(trace + 1.0) * 2;
                    qw = 0.25 * S;
                    qx = (m[6] - m[9]) / S;
                    qy = (m[8] - m[2]) / S;
                    qz = (m[1] - m[4]) / S;
                } else if ((m[0] > m[5]) && (m[0] > m[10])) {
                    S = Math.sqrt(1.0 + m[0] - m[5] - m[10]) * 2;
                    qw = (m[6] - m[9]) / S;
                    qx = 0.25 * S;
                    qy = (m[1] + m[4]) / S;
                    qz = (m[8] + m[2]) / S;
                } else if (m[5] > m[10]) {
                    S = Math.sqrt(1.0 + m[5] - m[0] - m[10]) * 2;
                    qw = (m[8] - m[2]) / S;
                    qx = (m[1] + m[4]) / S;
                    qy = 0.25 * S;
                    qz = (m[6] + m[9]) / S;
                } else {
                    S = Math.sqrt(1.0 + m[10] - m[0] - m[5]) * 2;
                    qw = (m[1] - m[4]) / S;
                    qx = (m[8] + m[2]) / S;
                    qy = (m[6] + m[9]) / S;
                    qz = 0.25 * S;
                }

                this.position.set(x, y, z);
                this.quaternion.set(qx, qy, qz, qw);
            }

            if (data.projection_camera) {
                const m = data.projection_camera;
                if (m[5]) {
                    const fovy = 2 * Math.atan(1 / m[5]);
                    if (isFinite(fovy)) {
                        this.fovy = fovy;
                    }
                }
            }
        }
    }

    // --- Main Installation ---
    window.bridge_onARData = (data) => device.onARData(data);

})();