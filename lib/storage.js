// Optimization ideas if benchmarking reveals performance issues:
//
// - Do not parse the old runs. The string obtained from localStorage must look like this:
//       '["old_run","old_run",...]'
//   We could stringify the new run and insert it after the opening bracket:
//       '["new_run","old_run","old_run",...]'
//   Bonus: when the quota is exceeded, we remove the second half of the array, which is more
//   performant than removing the first half.
//
// - Compression: https://github.com/pieroxy/lz-string
//   Could be especially good if the history contains many mostly-similar runs.
//
// - When trimming because of maxRuns, remove half of the array instead of typically just one run.
//   This way, future saves will not need to trim.

const runsKey = 'playbyplay_runs_A*O%y21#Q1WSh^f09YO!';

// Max history size in bytes.
const maxBytes = 50000;

// Max length of the stored string. Assumes 16 bits per character.
const maxLength = maxBytes * 8 / 16;

const maxRuns = 200;

// Save

export function save(run) {
    const runs = load();
    if (runs.length && sameRun(run, runs[runs.length - 1])) {
        return;
    }

    runs.push(run);
    saveRuns(runs);
}

function sameRun(a, b) {
    return a && b && a.input === b.input && a.output === b.output;
}

function saveRuns(runs) {
    if (runs.length > maxRuns) {
        runs.splice(0, runs.length - maxRuns);
    }

    while (true) {
        let runsStr = JSON.stringify(runs);

        if (runsStr.length > maxLength) {
            if (runs.length < 2) {
                console.error(`playbyplay: cannot save run of length ${runsStr.length}, ` +
                    `limit is ${maxLength} code units`);
                return;
            }

            trim(runs);
            continue;
        }

        try {
            localStorage[runsKey] = runsStr;
            return;
        } catch (e) {
            if (isQuotaError(e)) {
                if (runs.length < 2) {
                    console.error(`playbyplay: cannot save run of length ${runsStr.length}, ` +
                        `exceeds localStorage quota`);
                    return;
                }

                console.error('playbyplay: localStorage quota exceeded, discarding oldest ' +
                    'half of history and retrying');
                trim(runs);
                continue;
            }

            console.error('playbyplay: could not save run to localStorage', e);
            return;
        }
    }
}

function trim(runs) {
    runs.splice(runs.length / 2, Number.MAX_VALUE);
}

function isQuotaError(e) {
    return e && (e.code === 22 || e.code === 1014 && e.name === 'NS_ERROR_DOM_QUOTA_REACHED');
}

// Load

export function load() {
    const runsStr = localStorage[runsKey];
    if (!runsStr) {
        return [];
    }

    const runs = safeParseJSON(runsStr);
    if (!Array.isArray(runs)) {
        return [];
    }

    return runs;
}

function safeParseJSON(str, fallback) {
    try {
        return JSON.parse(str);
    } catch (e) {
    }

    return fallback;
}
