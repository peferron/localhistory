import support from './support';
import * as storage from './storage';

function save(run) {
    if (!support()) {
        return;
    }

    if (!run || !run.input || !run.output) {
        console.error('playbyplay.save: input and output properties are required');
        return;
    }

    setTimeout(() => storage.save(run), 0);
}

function load() {
    if (!support()) {
        return [];
    }

    return storage.load();
}

export default {save, load};
