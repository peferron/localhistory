import support from './support';
import * as storage from './storage';

export function save(run, done) {
    if (!support()) {
        return;
    }

    setTimeout(() => {
        storage.save(run);
        if (done) {
            done();
        }
    }, 0);
}

export function load() {
    if (!support()) {
        return [];
    }

    return storage.load();
}

export function clear() {
    if (!support()) {
        return;
    }

    storage.clear();
}
