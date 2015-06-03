import support from './support';
import * as storage from './storage';

export function save(run) {
    if (!support()) {
        return;
    }

    setTimeout(() => storage.save(run), 0);
}

export function load() {
    if (!support()) {
        return [];
    }

    return storage.load();
}

export function clear() {
    if (!support()) {
        return [];
    }

    return storage.clear();
}
