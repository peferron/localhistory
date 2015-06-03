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

const supportsJSON = 'JSON' in window && 'parse' in JSON && 'stringify' in JSON;
const supportsIsArray = 'isArray' in Array;
const supportsConsole = 'console' in window && 'log' in console && 'error' in console;

export default function check() {
    if (supportsLocalStorage && supportsJSON && supportsIsArray) {
        return true;
    }

    if (supportsConsole) {
        console.error('playbyplay is not supported in this browser');
    }

    return false;
}
