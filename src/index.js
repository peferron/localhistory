import * as support from './support';
import * as storage from './storage';

const now = fn => fn();

function promisify(syncFn, callback, asyncFn = now) {
    if (!support.promise) {
        asyncFn(() => {
            exec(syncFn, callback);
        });

        return;
    }

    return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
        asyncFn(() => {
            exec(syncFn, (err, result) => {
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

export function save(run, callback) {
    return promisify(() => {
        support.check();
        storage.save(run);
    }, callback, setTimeout);
}

export function load(callback) {
    return promisify(() => {
        support.check();
        return storage.load();
    }, callback);
}

export function clear(callback) {
    return promisify(() => {
        support.check();
        storage.clear();
    }, callback);
}
