import * as support from './support';
import * as storage from './storage';
import promisify from './promisify';

export const supported = support.supported;

export function append(run, options, callback) {
    const cb = typeof options === 'function' ? options : callback;
    const opts = fillAppendOptions(typeof options === 'object' ? options : {});

    return promisify(() => {
        support.throwIfUnsupported();
        storage.append(run, opts);
    }, cb, setTimeout);
}

function fillAppendOptions(options) {
    if (isNaN(options.maxRuns)) {
        options.maxRuns = 100;
    }
    if (isNaN(options.maxBytes)) {
        options.maxBytes = 100000;
    }
    return options;
}

export function load(callback) {
    return promisify(() => {
        support.throwIfUnsupported();
        return storage.load();
    }, callback);
}

export function clear(callback) {
    return promisify(() => {
        support.throwIfUnsupported();
        storage.clear();
    }, callback);
}
