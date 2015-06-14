// Required features.

const supportsLocalStorage = (() => {
    const key = 'localhistory_support_' + Math.random();
    const value = '' + Math.random();
    let success = false;

    try {
        localStorage[key] = value;
        success = localStorage[key] === value;
    } catch (e) {}

    try {
        localStorage.removeItem(key);
    } catch (e) {
        success = false;
    }

    return success;
})();

export const supported = supportsLocalStorage && typeof JSON === 'object' && 'isArray' in Array;

export function throwIfUnsupported() {
    if (!supported) {
        throw new Error('This browser does not support localhistory');
    }
}

// Optional features.

export const promise = typeof Promise === 'function';

export function consoleWarn() {
    try {
        console.warn.apply(console, arguments); // eslint-disable-line no-console
    } catch (e) {}
}
