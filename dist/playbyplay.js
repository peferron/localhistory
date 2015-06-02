'use strict';

function save(run) {
    if (!support()) {
        return;
    }

    if (!run || !run.input || !run.output) {
        console.error('playbyplay.save: input and output properties are required');
        return;
    }

    setTimeout(function () {
        return storage.save(run);
    }, 0);
}

function load() {
    if (!support()) {
        return [];
    }

    return storage.load();
}
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

'use strict';

var runsKey = 'playbyplay_runs_A*O%y21#Q1WSh^f09YO!';

// Max history size in bytes.
var maxBytes = 50000;

// Max length of the stored string. Assumes 16 bits per character.
var maxLength = maxBytes * 8 / 16;

var maxRuns = 200;

// Save

function save(run) {
    var runs = load();
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
        var runsStr = JSON.stringify(runs);

        if (runsStr.length > maxLength) {
            if (runs.length < 2) {
                console.error('playbyplay: cannot save run of length ' + runsStr.length + ', ' + ('limit is ' + maxLength + ' code units'));
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
                    console.error('playbyplay: cannot save run of length ' + runsStr.length + ', ' + 'exceeds localStorage quota');
                    return;
                }

                console.error('playbyplay: localStorage quota exceeded, discarding oldest ' + 'half of history and retrying');
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

function load() {
    var runsStr = localStorage[runsKey];
    if (!runsStr) {
        return [];
    }

    var runs = safeParseJSON(runsStr);
    if (!Array.isArray(runs)) {
        return [];
    }

    return runs;
}

function safeParseJSON(str, fallback) {
    try {
        return JSON.parse(str);
    } catch (e) {}

    return fallback;
}
'use strict';

var supportsLocalStorage = (function () {
    var key = 'playbyplay_support_Vo8yTd6aLS$A8huo9$e7';
    var value = Math.random() + '';

    try {
        localStorage[key] = value;
        if (localStorage[key] !== value) {
            return false;
        }
    } catch (e) {
        return false;
    }

    return true;
})();

var supportsJSON = 'JSON' in window && 'parse' in JSON && 'stringify' in JSON;

var supportsIsArray = ('isArray' in Array);

var supportsConsole = 'console' in window && 'log' in console && 'error' in console;

function check() {
    if (supportsLocalStorage && supportsJSON && supportsIsArray) {
        return true;
    }

    if (supportsConsole) {
        console.error('playbyplay is not supported in this browser');
    }

    return false;
}
