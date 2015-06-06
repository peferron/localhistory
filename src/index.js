import * as support from './support';
import * as storage from './storage';

function runWithCallback(fn, callback) {
    let err = null;
    let result;
    try {
        result = fn();
    } catch (e) {
        err = e;
    }

    if (callback) {
        callback(err, result);
    }
}

function saveNow(run, callback) {
    runWithCallback(() => {
        support.check();
        storage.save(run);
    }, callback);
}

export function save(run, callback) {
    setTimeout(() => {
        saveNow(run, callback);
    }, 0);
}

export function load(callback) {
    runWithCallback(() => {
        support.check();
        return storage.load();
    }, callback);
}

export function clear(callback) {
    runWithCallback(() => {
        support.check();
        storage.clear();
    }, callback);
}
