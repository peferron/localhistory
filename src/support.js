const supportsLocalStorage = (() => {
    const key = 'playbyplay_support_Vo8yTd6aLS$A8huo9$e7';
    const value = Math.random() + '';

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

const supportsJSON = typeof window !== 'undefined' &&
    'JSON' in window &&
    'parse' in JSON &&
    'stringify' in JSON;

const supportsIsArray = 'isArray' in Array;

export function check() {
    if (!supportsLocalStorage) {
        throw new Error('localStorage is not supported');
    }

    if (!supportsJSON) {
        throw new Error('JSON is not supported');
    }

    if (!supportsIsArray) {
        throw new Error('Array.isArray is not supported');
    }
}
