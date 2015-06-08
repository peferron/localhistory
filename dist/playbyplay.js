(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.playbyplay = {});
})(this, function (exports) {
    'use strict';

    var support = Object.defineProperties({}, {
        supported: {
            get: function () {
                return support__supported;
            },
            configurable: true,
            enumerable: true
        },
        throwIfUnsupported: {
            get: function () {
                return throwIfUnsupported;
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
        consoleWarn: {
            get: function () {
                return consoleWarn;
            },
            configurable: true,
            enumerable: true
        }
    });

    // Required features.

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

    var support__supported = supportsLocalStorage && typeof JSON === 'object' && 'isArray' in Array;

    function throwIfUnsupported() {
        if (!support__supported) {
            throw new Error('This browser does not support playbyplay');
        }
    }

    // Optional features.

    var promise = typeof Promise === 'function';

    function consoleWarn() {
        try {
            console.warn.apply(console, arguments); // eslint-disable-line no-console
        } catch (e) {}
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

    function storage__save(run, options) {
        if (options.maxRuns < 1) {
            throw new Error('Could not save run, maxRuns is ' + options.maxRuns);
        }

        var runs = undefined;
        try {
            runs = storage__load();
        } catch (err) {
            support.consoleWarn('playbyplay: could not load previous runs, resetting history', err);
            runs = [];
        }

        if (runs.length && sameRun(run, runs[runs.length - 1])) {
            return;
        }

        runs.push(run);
        saveRuns(runs, options);
    }

    function sameRun(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function saveRuns(runs, options) {
        if (runs.length > options.maxRuns) {
            runs.splice(0, runs.length - options.maxRuns);
        }

        while (true) {
            // eslint-disable-line no-constant-condition
            var runsStr = JSON.stringify(runs);

            var runsBytes = runsStr.length * 2; // Assumes 16 bits (2 bytes) per code point.
            if (runsBytes > options.maxBytes) {
                if (runs.length < 2) {
                    throw new Error('Could not save run of length ' + runsStr.length + ' ' + ('(' + runsBytes + ' bytes), maxBytes is ' + options.maxBytes));
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

    function storage__clear() {
        localStorage.removeItem(runsKey);
    }

    function now(fn) {
        fn();
    }

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

    var index__supported = support.supported;

    function index__save(run, options, callback) {
        var cb = typeof options === 'function' ? options : callback;
        var opts = fillSaveOptions(typeof options === 'object' ? options : {});

        return promisify(function () {
            support.throwIfUnsupported();
            storage.save(run, opts);
        }, cb, setTimeout);
    }

    function fillSaveOptions(options) {
        if (isNaN(options.maxRuns)) {
            options.maxRuns = 100;
        }
        if (isNaN(options.maxBytes)) {
            options.maxBytes = 100000;
        }
        return options;
    }

    function index__load(callback) {
        return promisify(function () {
            support.throwIfUnsupported();
            return storage.load();
        }, callback);
    }

    function index__clear(callback) {
        return promisify(function () {
            support.throwIfUnsupported();
            storage.clear();
        }, callback);
    }

    exports.supported = index__supported;
    exports.save = index__save;
    exports.load = index__load;
    exports.clear = index__clear;
});
//# sourceMappingURL=./playbyplay.js.map
// eslint-disable-line no-empty