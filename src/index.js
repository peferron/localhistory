import * as support from './support';
import * as storage from './storage';

export function save(run, callback) {
    setTimeout(() => {
        let err = null;
        try {
            support.check();
            storage.save(run);
        } catch (e) {
            err = e;
        }

        if (callback) {
            callback(err);
        }
    }, 0);
}

export function load(callback) {
    let err = null;
    let runs;
    try {
        support.check();
        runs = storage.load();
    } catch (e) {
        err = e;
    }

    if (callback) {
        callback(err, runs);
    }
}

export function clear(callback) {
    let err = null;
    try {
        support.check();
        storage.clear();
    } catch (e) {
        err = e;
    }

    if (callback) {
        callback(err);
    }
}
