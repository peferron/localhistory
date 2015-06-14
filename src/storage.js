import * as support from './support';

const runsKey = 'localhistory_runs_A*O%y21#Q1WSh^f09YO!';

export function save(run, options) {
    if (options.maxRuns < 1) {
        throw new Error(`Could not save run, maxRuns is ${options.maxRuns}`);
    }

    let runs;
    try {
        runs = load();
    } catch (err) {
        support.consoleWarn('localhistory: could not load previous runs, resetting history', err);
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

    while (true) { // eslint-disable-line no-constant-condition
        const runsStr = JSON.stringify(runs);

        const runsBytes = runsStr.length * 2; // Assumes 16 bits (2 bytes) per code point.
        if (runsBytes > options.maxBytes) {
            if (runs.length < 2) {
                throw new Error(`Could not save run of length ${runsStr.length} ` +
                    `(${runsBytes} bytes), maxBytes is ${options.maxBytes}`);
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
