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

const supportsJSON = typeof JSON === 'object';

const supportsIsArray = 'isArray' in Array;

export function required() {
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

// Cannot directly write `export const console = ...` because it would redefine `console` in the
// current scope.
const supportsConsole = typeof console === 'object';
export {supportsConsole as console};

export const promise = typeof Promise === 'function';
