// See http://stackoverflow.com/a/2117523/1362272 and related answers

const randSalt = selectRandSaltFunction();

function selectRandSaltFunction() {
    if (typeof globalThis !== 'undefined' && globalThis.performance && typeof globalThis.performance.now === "function") {
        return function () {
            return globalThis.performance.now();
        }
    }
    else if (Date.now) {
        return function () {
            return Date.now();
        }
    }
    else {
        return function () {
            return new Date().getTime();
        }
    }
}

/**
 * Creates a new pseudo-random Globally Unique Identifier.
 */
export function createGuid(): string {
    let d = randSalt();

    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}

export const emptyGuid = '00000000-0000-0000-0000-000000000000';