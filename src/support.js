// Required features.

const supportsLocalStorage = (() => {
    const key = 'playbyplay_support_Vo8yTd6aLS$A8huo9$e7';
    const value = Math.random() + '';

    try {
        localStorage[key] = value;
        const success = localStorage[key] === value;
        localStorage.removeItem(key);
        return success;
    } catch (e) {
        return false;
    }
})();

export const supported = supportsLocalStorage && typeof JSON === 'object' && 'isArray' in Array;

export function throwIfUnsupported() {
    if (!supported) {
        throw new Error('This browser does not support playbyplay');
    }
}

// Optional features.

export const promise = typeof Promise === 'function';

export function consoleWarn() {
    try {
        console.warn.apply(console, arguments); // eslint-disable-line no-console
    } catch (e) { // eslint-disable-line no-empty
    }
}
