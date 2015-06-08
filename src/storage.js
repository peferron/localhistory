import * as support from './support';

const runsKey = 'playbyplay_runs_A*O%y21#Q1WSh^f09YO!';

export function save(run, options) {
    let runs;
    try {
        runs = load();
    } catch (err) {
        support.consoleWarn('playbyplay: could not load previous runs, resetting history', err);
        runs = [];
    }

    if (runs.length && sameRun(run, runs[runs.length - 1])) {
        return;
    }

    runs.push(run);
    saveRuns(runs, options);
}

function sameRun(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function saveRuns(runs, options) {
    if (runs.length > options.maxRuns) {
        runs.splice(0, runs.length - options.maxRuns);
    }

    // Max history string length. Assumes 16 bits per code point.
    const maxLength = options.maxBytes * 8 / 16;

    while (true) { // eslint-disable-line no-constant-condition
        let runsStr = JSON.stringify(runs);

        if (runsStr.length > maxLength) {
            if (runs.length < 2) {
                throw new Error(`Could not save run of length ${runsStr.length}, ` +
                    `maxBytes is ${options.maxBytes}`);
            }

            removeFirstHalf(runs);
            continue;
        }

        try {
            localStorage[runsKey] = runsStr;
            return;
        } catch (err) {
            if (isQuotaError(err)) {
                if (runs.length < 2) {
                    throw new Error(`Could not save run of length ${runsStr.length}, ` +
                        `exceeds localStorage quota`);
                }

                removeFirstHalf(runs);
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

export function load() {
    const runsStr = localStorage[runsKey];
    if (!runsStr) {
        return [];
    }

    const runs = JSON.parse(runsStr);
    if (!Array.isArray(runs)) {
        throw new Error('Loaded runs are not an Array');
    }

    return runs;
}

export function clear() {
    localStorage.removeItem(runsKey);
}
