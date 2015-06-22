import * as support from './support';
import * as storage from './storage';
import promisify from './promisify';

export const supported = support.supported;

// key and entry are required, options and callback are optional.
export function append(key, entry, options, callback) {
    const cb = typeof options === 'function' ? options : callback;
    const opts = fillAppendOptions(options && typeof options === 'object' ? options : {});

    return promisify(() => {
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
export function load(key, callback) {
    return promisify(() => {
        support.throwIfUnsupported();
        return storage.load(key);
    }, callback);
}

// key is required, callback is optional.
export function clear(key, callback) {
    return promisify(() => {
        support.throwIfUnsupported();
        storage.clear(key);
    }, callback);
}
