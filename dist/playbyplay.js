(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.playbyplay = {});
})(this, function (exports) {
    'use strict';

    var support = Object.defineProperties({}, {
        required: {
            get: function () {
                return required;
            },
            configurable: true,
            enumerable: true
        },
        promise: {
            get: function () {
                return promise;
            },
            configurable: true,
            enumerable: true
        },
        console: {
            get: function () {
                return supportsConsole;
            },
            configurable: true,
            enumerable: true
        }
    });

    // Required features

    var supportsLocalStorage = (function () {
        var key = 'playbyplay_support_Vo8yTd6aLS$A8huo9$e7';
        var value = Math.random() + '';

        try {
            localStorage[key] = value;
            var success = localStorage[key] === value;
            localStorage.removeItem(key);
            return success;
        } catch (e) {
            return false;
        }
    })();

    var supportsJSON = typeof JSON === 'object';

    var supportsIsArray = ('isArray' in Array);

    function required() {
        if (!supportsLocalStorage) {
            throw new Error('localStorage is not supported');
        }

        if (!supportsJSON) {
            throw new Error('JSON is not supported');
        }

        if (!supportsIsArray) {
            throw new Error('Array.isArray is not supported');
        }
    }

    // Optional features

    var promise = typeof Promise === 'function';

    // Cannot directly write `export const console = ...` because it would redefine `console` in the
    // current scope.
    var supportsConsole = typeof console === 'object';

    var storage = Object.defineProperties({}, {
        save: {
            get: function () {
                return storage__save;
            },
            configurable: true,
            enumerable: true
        },
        load: {
            get: function () {
                return storage__load;
            },
            configurable: true,
            enumerable: true
        },
        clear: {
            get: function () {
                return storage__clear;
            },
            configurable: true,
            enumerable: true
        }
    });

    var runsKey = 'playbyplay_runs_A*O%y21#Q1WSh^f09YO!';

    var maxBytes = 50000; // Max history size in bytes.
    var maxLength = maxBytes * 8 / 16; // Max history string length. Assumes 16 bits per code point.
    var maxRuns = 200; // Max runs in history.

    // Save

    function storage__save(run) {
        var runs = undefined;
        try {
            runs = storage__load();
        } catch (err) {
            if (support.console) {
                console.error('playbyplay: could not load previous runs, resetting history', err);
            }

            runs = [];
        }

        if (runs.length && sameRun(run, runs[runs.length - 1])) {
            return;
        }

        runs.push(run);
        saveRuns(runs);
    }

    function sameRun(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function saveRuns(runs) {
        if (runs.length > maxRuns) {
            runs.splice(0, runs.length - maxRuns);
        }

        while (true) {
            // eslint-disable-line no-constant-condition
            var runsStr = JSON.stringify(runs);

            if (runsStr.length > maxLength) {
                if (runs.length < 2) {
                    throw new Error('Could not save run of length ' + runsStr.length + ', ' + ('the maximum length is ' + maxLength));
                }

                removeFirstHalf(runs);
                continue;
            }

            try {
                localStorage[runsKey] = runsStr;
                return;
            } catch (err) {
                if (isQuotaError(err)) {
                    if (runs.length < 2) {
                        throw new Error('Could not save run of length ' + runsStr.length + ', ' + 'exceeds localStorage quota');
                    }

                    removeFirstHalf(runs);
                    continue;
                }

                throw err;
            }
        }
    }

    function removeFirstHalf(arr) {
        arr.splice(0, Math.ceil(arr.length / 2));
    }

    function isQuotaError(err) {
        return err && (err.code === 22 || err.code === 1014 && err.name === 'NS_ERROR_DOM_QUOTA_REACHED');
    }

    // Load

    function storage__load() {
        var runsStr = localStorage[runsKey];
        if (!runsStr) {
            return [];
        }

        var runs = JSON.parse(runsStr);
        if (!Array.isArray(runs)) {
            throw new Error('Loaded runs are not an Array');
        }

        return runs;
    }

    // Clear

    function storage__clear() {
        localStorage.removeItem(runsKey);
    }

    function index__save(run, callback) {
        return promisify(function () {
            support.required();
            storage.save(run);
        }, callback, setTimeout);
    }

    function index__load(callback) {
        return promisify(function () {
            support.required();
            return storage.load();
        }, callback);
    }

    function index__clear(callback) {
        return promisify(function () {
            support.required();
            storage.clear();
        }, callback);
    }

    // Optional promises

    var now = function now(fn) {
        return fn();
    };

    function promisify(syncFn, callback) {
        var asyncFn = arguments[2] === undefined ? now : arguments[2];

        if (!support.promise) {
            asyncFn(function () {
                exec(syncFn, callback);
            });

            return;
        }

        return new Promise(function (resolve, reject) {
            // eslint-disable-line consistent-return
            asyncFn(function () {
                exec(syncFn, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }

                    if (callback) {
                        callback(err, result);
                    }
                });
            });
        });
    }

    function exec(fn, callback) {
        var err = null;
        var result = undefined;
        try {
            result = fn();
        } catch (e) {
            err = e;
        }

        if (callback) {
            callback(err, result);
        }
    }

    exports.save = index__save;
    exports.load = index__load;
    exports.clear = index__clear;
});
//# sourceMappingURL=./playbyplay.js.map