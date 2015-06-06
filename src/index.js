import * as support from './support';
import * as storage from './storage';

export function save(run, callback) {
    setTimeout(() => {
        try {
            support.check();
            storage.save(run);
            callback(null);
        } catch (err) {
            callback(err);
        }
    }, 0);
}

export function load(callback) {
    try {
        support.check();
        const runs = storage.load();
        callback(null, runs);
    } catch (err) {
        callback(err);
    }
}

export function clear(callback) {
    try {
        support.check();
        storage.clear();
        callback(null);
    } catch (err) {
        callback(err);
    }
}
