import * as support from './support';
import * as storage from './storage';
import promisify from './promisify';

export const supported = support.supported;

export function append(key, entry, options, callback) {
    const cb = typeof options === 'function' ? options : callback;
    const opts = fillAppendOptions(typeof options === 'object' ? options : {});

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
    return options;
}

export function load(key, callback) {
    return promisify(() => {
        support.throwIfUnsupported();
        return storage.load(key);
    }, callback);
}

export function clear(key, callback) {
    return promisify(() => {
        support.throwIfUnsupported();
        storage.clear(key);
    }, callback);
}
