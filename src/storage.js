import * as support from './support';

export function append(key, entry, options) {
    if (options.maxEntries < 1) {
        throw new Error(`Could not append entry, maxEntries is ${options.maxEntries}`);
    }

    let entries;
    try {
        entries = load(key);
    } catch (err) {
        support.consoleWarn('localhistory: could not load previous entries, resetting history',
            err.message);
        entries = [];
    }

    if (entries.length && sameEntry(entry, entries[entries.length - 1])) {
        return;
    }

    entries.push(entry);
    appendEntries(key, entries, options);
}

function sameEntry(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function appendEntries(key, entries, options) {
    if (entries.length > options.maxEntries) {
        entries.splice(0, entries.length - options.maxEntries);
    }

    while (true) { // eslint-disable-line no-constant-condition
        const entriesStr = JSON.stringify(entries);

        const entriesBytes = entriesStr.length * 2; // Assumes 16 bits (2 bytes) per code point.
        if (entriesBytes > options.maxBytes) {
            if (entries.length < 2) {
                throw new Error(`Could not append entry of length ${entriesStr.length} ` +
                    `(${entriesBytes} bytes), maxBytes is ${options.maxBytes}`);
            }

            removeFirstHalf(entries);
            continue;
        }

        try {
            localStorage[key] = entriesStr;
            return;
        } catch (err) {
            if (isQuotaError(err)) {
                if (entries.length < 2) {
                    throw new Error(`Could not append entry of length ${entriesStr.length}, ` +
                        `exceeds localStorage quota`);
                }

                removeFirstHalf(entries);
                continue;
            }

            throw err;
        }
    }
}

function removeFirstHalf(arr) {
    arr.splice(0, Math.ceil(arr.length / 2));
}

function isQuotaError(err) {
    return err &&
        (err.code === 22 ||
         err.code === 1014 && err.name === 'NS_ERROR_DOM_QUOTA_REACHED');
}

export function load(key) {
    const entriesStr = localStorage[key];
    if (!entriesStr) {
        return [];
    }

    const entries = JSON.parse(entriesStr);
    if (!Array.isArray(entries)) {
        throw new Error('Loaded entries are not an Array');
    }

    return entries;
}

export function clear(key) {
    localStorage.removeItem(key);
}
