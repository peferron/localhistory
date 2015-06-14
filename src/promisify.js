import * as support from './support';

export default function promisify(fn, callback) {
    if (!support.promise) {
        exec(fn, callback);
        return;
    }

    return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
        exec(fn, (err, result) => {
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
