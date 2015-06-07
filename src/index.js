import * as support from './support';
import * as storage from './storage';
import promisify from './promisify';

export const supported = support.supported;

export function save(run, callback) {
    return promisify(() => {
        support.throwIfUnsupported();
        storage.save(run);
    }, callback, setTimeout);
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
