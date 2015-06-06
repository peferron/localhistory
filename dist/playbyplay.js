(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.playbyplay = {});
})(this, function (exports) {
    'use strict';

    var supportsLocalStorage = (function () {
        var key = 'playbyplay_support_Vo8yTd6aLS$A8huo9$e7';
        var value = Math.random() + '';

        try {
            localStorage[key] = value;
            if (localStorage[key] !== value) {
                return false;
            }
        } catch (e) {
            return false;
        }

        return true;
    })();

    var supportsJSON = typeof window !== 'undefined' && 'JSON' in window && 'parse' in JSON && 'stringify' in JSON;

    var supportsIsArray = ('isArray' in Array);

    function check() {
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

    // Max history size in bytes.
    var maxBytes = 50000;

    // Max length of the history string. Assumes 16 bits per character.
    var maxLength = maxBytes * 8 / 16;

    // Max runs in history.
    var maxRuns = 200;

    // Save

    function storage__save(run) {
        var runs = undefined;
        try {
            runs = storage__load();
        } catch (err) {
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
        setTimeout(function () {
            try {
                check();
                storage.save(run);
                callback(null);
            } catch (err) {
                callback(err);
            }
        }, 0);
    }

    function index__load(callback) {
        try {
            check();
            var runs = storage.load();
            callback(null, runs);
        } catch (err) {
            callback(err);
        }
    }

    function index__clear(callback) {
        try {
            check();
            storage.clear();
            callback(null);
        } catch (err) {
            callback(err);
        }
    }

    exports.save = index__save;
    exports.load = index__load;
    exports.clear = index__clear;
});
//# sourceMappingURL=./playbyplay.js.map