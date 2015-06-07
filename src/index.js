import * as support from './support';
import * as storage from './storage';
import promisify from './promisify';

export const supported = support.supported;

export function save(run, options, callback) {
    const cb = typeof options === 'function' ? options : callback;
    const opts = fillSaveOptions(typeof options === 'object' ? options : {});

    return promisify(() => {
        support.throwIfUnsupported();
        storage.save(run, opts);
    }, cb, setTimeout);
}

function fillSaveOptions(options) {
    if (isNaN(options.maxBytes)) {
        options.maxBytes = 50000;
    }
    if (isNaN(options.maxRuns)) {
        options.maxRuns = 200;
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
