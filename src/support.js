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

export function required() {
    if (!supportsLocalStorage) {
        throw new Error('localStorage is not supported');
    }

    if (typeof JSON !== 'object') {
        throw new Error('JSON is not supported');
    }

    if (!('isArray' in Array)) {
        throw new Error('Array.isArray is not supported');
    }
}

export const promise = typeof Promise === 'function';

export function consoleWarn() {
    try {
        console.warn.apply(console, arguments); // eslint-disable-line no-console
    } catch (e) { // eslint-disable-line no-empty
    }
}
