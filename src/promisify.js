import * as support from './support';

function now(fn) {
    fn();
}

export default function promisify(syncFn, callback, asyncFn = now) {
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
