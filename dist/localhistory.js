/* localhistory v1.0.0 | https://github.com/peferron/localhistory | License: MIT */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.localhistory = {});
})(this, function (exports) {

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
        var key = 'localhistory_support_' + Math.random();
        var value = '' + Math.random();
        var success = false;

        try {
            localStorage[key] = value;
            success = localStorage[key] === value;
        } catch (e) {}

        try {
            localStorage.removeItem(key);
        } catch (e) {
            success = false;
        }

        return success;
    })();

    var support__supported = supportsLocalStorage && typeof JSON === 'object' && 'isArray' in Array;

    function throwIfUnsupported() {
        if (!support__supported) {
            throw new Error('This browser does not support localhistory');
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
        append: {
            get: function () {
                return storage__append;
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

    function storage__append(key, entry, options) {
        if (options.maxEntries < 1) {
            throw new Error('Could not append entry, maxEntries is ' + options.maxEntries);
        }

        var entries = undefined;
        try {
            entries = storage__load(key);
        } catch (err) {
            support.consoleWarn('localhistory: could not load previous entries, resetting history', err.message);
            entries = [];
        }

        if (!options.appendIfEqualToLast && entries.length && sameEntry(entry, entries[entries.length - 1])) {
            return;
        }

        entries.push(entry);
        appendEntries(key, entries, options);
    }

    function sameEntry(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function appendEntries(key, entries, options) {
        if (entries.length > options.maxEntries) {
            entries.splice(0, entries.length - options.maxEntries);
        }

        while (true) {
            // eslint-disable-line no-constant-condition
            var entriesStr = JSON.stringify(entries);

            var entriesBytes = entriesStr.length * 2; // Assumes 16 bits (2 bytes) per code point.
            if (entriesBytes > options.maxBytes) {
                if (entries.length < 2) {
                    throw new Error('Could not append entry of length ' + entriesStr.length + ' ' + ('(' + entriesBytes + ' bytes), maxBytes is ' + options.maxBytes));
                }

                removeFirstHalf(entries);
                continue;
            }

            try {
                localStorage[key] = entriesStr;
                return;
            } catch (err) {
                if (isQuotaError(err)) {
                    if (entries.length < 2) {
                        throw new Error('Could not append entry of length ' + entriesStr.length + ', ' + 'exceeds localStorage quota');
                    }

                    removeFirstHalf(entries);
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

    function storage__load(key) {
        var entriesStr = localStorage[key];
        if (!entriesStr) {
            return [];
        }

        var entries = JSON.parse(entriesStr);
        if (!Array.isArray(entries)) {
            throw new Error('Loaded entries are not an Array');
        }

        return entries;
    }

    function storage__clear(key) {
        localStorage.removeItem(key);
    }

    function promisify(fn, callback) {
        if (!support.promise) {
            exec(fn, callback);
            return;
        }

        return new Promise(function (resolve, reject) {
            // eslint-disable-line consistent-return
            exec(fn, function (err, result) {
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

    // key and entry are required, options and callback are optional.
    function index__append(key, entry, options, callback) {
        var cb = typeof options === 'function' ? options : callback;
        var opts = fillAppendOptions(options && typeof options === 'object' ? options : {});

        return promisify(function () {
            support.throwIfUnsupported();
            storage.append(key, entry, opts);
        }, cb);
    }

    function fillAppendOptions(options) {
        if (isNaN(options.maxEntries)) {
            options.maxEntries = 100;
        }
        if (isNaN(options.maxBytes)) {
            options.maxBytes = 100000;
        }
        if (!options.hasOwnProperty('appendIfEqualToLast')) {
            options.appendIfEqualToLast = true;
        }
        return options;
    }

    // key is required, callback is optional.
    function index__load(key, callback) {
        return promisify(function () {
            support.throwIfUnsupported();
            return storage.load(key);
        }, callback);
    }

    // key is required, callback is optional.
    function index__clear(key, callback) {
        return promisify(function () {
            support.throwIfUnsupported();
            storage.clear(key);
        }, callback);
    }

    exports.supported = index__supported;
    exports.append = index__append;
    exports.load = index__load;
    exports.clear = index__clear;
});
//# sourceMappingURL=./localhistory.js.map