'use strict';

/** STRING **/
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// Not used
// String.prototype.escapeRegexCharacters = function () {
//     return this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// };

// Not used
// String.prototype.toCamelCase = () => {
//     // remove all characters that should not be in a variable name
//     let string = this.replace(/([^a-zA-Z0-9_\- ])|^[_0-9]+/g, "").trim().toLowerCase();
//     // uppercase letters preceded by a hyphen or a space or an underscore
//     string = string.replace(/([ -_]+)([a-zA-Z0-9])/g, function (a, b, c) {
//         return c.toUpperCase();
//     });
//     // uppercase letters following numbers
//     string = string.replace(/([0-9]+)([a-zA-Z])/g, function (a, b, c) {
//         return b + c.toUpperCase();
//     });
//     return string;
// };
//
// String.prototype.toSnakeCase = function () {
//     return this.replace(/\.?([A-Z])/g, function (x, y) {
//         return '_' + y.toLowerCase()
//     }).replace(/^_/, '');
// };

/** ARRAY **/
Array.prototype.limit = function (limit) {
    if (this && !!limit) {
        return this.slice(0, limit);
    } else {
        return this;
    }
};

Array.prototype.shuffle = function () {
    for (let i = this.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [this[i - 1], this[j]] = [this[j], this[i - 1]];
    }
    return this;
};

Array.prototype.remove = function (item) {
    if (this) {
        return this.filter(value => value !== item);
    }
};

Array.prototype.common = function (otherArray) {
    return this.filter(function (i) {
        return otherArray.indexOf(i) >= 0;
    });
};

// Attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) {
        return false;
    }

    // compare lengths - can save a lot of time
    if (this.length !== array.length) {
        return false;
    }

    for (let i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

Array.prototype.isEqualIds = function (other) {
    if (this.length !== other.length) {
        return false;
    }

    return this.every(function (element, index) {
        if (!other[index]) {
            return false;
        }

        return element.id === other[index].id;
    });
};

Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.replace = function (key, newValue) {
    let newArray = [];
    this.forEach(function (oldValue, index, array) {
        if (oldValue[key] === newValue[key]) {
            newArray.push(newValue);
        } else {
            newArray.push(oldValue);
        }
    });
    return newArray;
};

Array.prototype.replaceOrAdd = function (key, newValue) {
    let newArray = [];
    let valueNotFound = true;
    this.forEach(function (oldValue, index, array) {
        if (oldValue[key] === newValue[key]) {
            newArray.push(newValue);
            valueNotFound = false;
        } else {
            newArray.push(oldValue);
        }
    });
    if (valueNotFound) {
        newArray.push(newValue);
    }
    return newArray;
};

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {

            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            const o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            const len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            const n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

Array.prototype.compact = function () {
    return this.filter((val) => !$.isEmpty(val));
};

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisArg */) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        const t = Object(this);
        const len = t.length >>> 0;

        // NOTE : fix to avoid very long loop on negative length value

        if (len > t.length || typeof fun !== 'function') {
            throw new TypeError();
        }

        let res = [];
        const thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (let i = 0; i < len; i++) {
            if (i in t) {
                const val = t[i];

                // NOTE: Techniquement on devrait utiliser Object.defineProperty
                //       pour le prochain index car push peut être affecté
                //       par les propriétés d'Object.prototype et d'Array.prototype.
                //       Cependant cette méthode est récente et les cas de collisions
                //       devraient rester rares : on préfère donc l'alternative la plus
                //       compatible.
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}

/** NEW FUNCTIONALITIES **/
$.extend({
    /** UTILS **/
    uuid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }),

    /** URL **/
    isURL: (url) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url),

    getUrlPaths: () => window.location.pathname.split('/'),

    getUrlAnchor: () => (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null,

    // Use:
    // decodeURIComponent($.urlParam('distance_slider'))
    // $.urlParam('distance_slider')
    getUrlParameter: (sParam) => {
        const sPageURL = window.location.search.substring(1);
        const sURLVariables = sPageURL.split('&');
        for (let i = 0; i < sURLVariables.length; i++) {
            let sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1];
            }
        }
    },

    getUrlParameters: () => {
        const query = window.location.search.substring(1);
        if (query === '') {
            return undefined;
        }

        let hash = {};
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            const k = decodeURIComponent(pair[0]);
            const v = decodeURIComponent(pair[1]);

            // If it is the first entry with this name
            if (typeof hash[k.substr(0, k.length - 2)] !== "undefined") {
                hash[k.substr(0, k.length - 2)].push(v);
            } else if (typeof hash[k] === "undefined") {
                // not end with []. cannot use negative index as IE doesn't understand it
                if (k.substr(k.length - 2) !== '[]') {
                    hash[k] = v;
                }
                else {
                    hash[k.substr(0, k.length - 2)] = [v];
                }
            } else if (typeof hash[k] === "string") {
                // If subsequent entry with this name and not array
                hash[k] = v;  // replace it
            } else {
                // If subsequent entry with this name and is array
                hash[k.substr(0, k.length - 2)].push(v);
            }
        }

        return hash;
    },

    decodeObject: (object) => {
        if (!object) {
            return object;
        }

        const data = decodeURIComponent(JSON.stringify(object).replace(/(%2E)/ig, "%20"));
        return JSON.parse(data);
    },

    // Not used
    // setUrlParameter: (paramName, paramValue) => {
    //     let url = window.location.href;
    //     if (url.indexOf(paramName + "=") >= 0) {
    //         let prefix = url.substring(0, url.indexOf(paramName));
    //         let suffix = url.substring(url.indexOf(paramName));
    //         suffix = suffix.substring(suffix.indexOf("=") + 1);
    //         suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
    //         url = prefix + paramName + "=" + paramValue + suffix;
    //     }
    //     else {
    //         if (url.indexOf("?") < 0)
    //             url += "?" + paramName + "=" + paramValue;
    //         else
    //             url += "&" + paramName + "=" + paramValue;
    //     }
    //     window.location.href = url;
    // },

    // Not used
    // fullDomainName: () => window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''),

    /** BROWSER **/
    // Not used
    // isSafari: () => navigator.appVersion.search('Safari') !== -1
    //         && navigator.appVersion.search('Chrome') === -1
    //         && navigator.appVersion.search('CrMo') === -1
    //         && navigator.appVersion.search('CriOS') === -1,

    // Not used
    // isIE: () => navigator.userAgent.toLowerCase().indexOf('msie') !== -1
    //         || navigator.userAgent.toLowerCase().indexOf('trident') !== -1,

    /** OBJECT **/
    compact: (object) => {
        let newObject = {};
        Object.keys(object).forEach((key) => {
            const value = object[key];
            if (!$.isEmpty(key) && !$.isEmpty(value)) {
                newObject[key] = value;
            }
        });
        return newObject;
    },

    omit: (obj, props, fn) => {
        if (typeof obj !== 'object') return {};

        if (typeof props === 'function') {
            fn = props;
            props = [];
        }

        if (typeof props === 'string') {
            props = [props];
        }

        var isFunction = typeof fn === 'function';
        var keys = Object.keys(obj);
        var res = {};

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = obj[key];

            if (!props || (props.indexOf(key) === -1 && (!isFunction || fn(val, key, obj)))) {
                res[key] = val;
            }
        }
        return res;
    },

    /** ARRAY **/
    toMap: (object, callback) => Object.keys(object).map((key, i) => callback(key, object[key], i)),

    arraySearchForValue: (arr, val, key) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] === val) {
                return arr[i];
            }
        }
        return false;
    },

    // Array must be sorted
    getClosestValue: (array, value) => {
        if ($.isEmpty(array)) return;

        let lo = -1, hi = array.length;
        while (hi - lo > 1) {
            const mid = Math.round((lo + hi) / 2);
            if (array[mid] <= value) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        if (array[lo] === value) hi = lo;

        const lowDiff = Math.abs(array[lo] - value);
        const highDiff = Math.abs(array[hi] - value);

        if (lowDiff < highDiff) {
            return array[lo];
        }
        else {
            return array[hi];
        }
    },

    // Not used
    // valuesInRange: (arr, min, max) => {
    //     arr = arr.sort((a, b) => a - b);
    //
    //     let len = arr.length,
    //         up = -1,
    //         down = len,
    //         rrange = [],
    //         mid = Math.floor(len / 2);
    //     while (up++ < mid && down-- > mid) {
    //         if (arr[up] >= max || arr[down] <= min) {
    //             break;
    //         }
    //         if (arr[up] >= min) {
    //             rrange.push(arr[up]);
    //         }
    //         if (arr[down] <= max) {
    //             rrange.push(arr[down]);
    //         }
    //     }
    //     return rrange;
    // },

    // Not used
    // Array must be sorted
    // getClosestValues: (array, value) => {
    //     if ($.isEmpty(array)) return;
    //
    //     let lo = -1, hi = array.length;
    //     while (hi - lo > 1) {
    //         let mid = Math.round((lo + hi) / 2);
    //         if (array[mid] <= value) {
    //             lo = mid;
    //         } else {
    //             hi = mid;
    //         }
    //     }
    //     if (array[lo] == value) hi = lo;
    //     return [array[lo], array[hi]];
    // },

    /** STRING **/
    caesarCipher: (string, shift) => {
        // Wrap the amount
        if (shift < 0) {
            return string.caesarCipher(shift + 26);
        }

        let output = '';

        // Go through each character
        for (let i = 0; i < string.length; i++) {

            // Get the character we'll be appending
            let c = string[i];

            // If it's a letter...
            if (c.match(/[a-z]/i)) {

                // Get its code
                let code = string.charCodeAt(i);

                // Uppercase letters
                if ((code >= 65) && (code <= 90))
                    c = String.fromCharCode(((code - 65 + shift) % 26) + 65);

                // Lowercase letters
                else if ((code >= 97) && (code <= 122))
                    c = String.fromCharCode(((code - 97 + shift) % 26) + 97);

            }

            output += c;
        }

        return output;
    },

    /** UTILITIES **/
    isEmpty: (obj) => {
        // null and undefined are "empty"
        if (obj == null) return true;
        if (obj === 'undefined' || obj === 'null' || obj === 'false') return true;

        // Boolean are not empty
        if (obj === true || obj === false) return false;

        // Check if is a Integer
        if (!isNaN(parseFloat(obj)) && isFinite(obj)) return false;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    },

    // Create the following functions :
    // isArray, isObject, isString, isDate, isRegExp, isFunction, isBoolean, isNull, isUndefined
    // USage : $.is().isArray(myArray);
    is: () => {
        let exports = {};

        const types = 'Array Object String Date RegExp Function Boolean Null Undefined'.split(' ');

        const type = function () {
            return Object.prototype.toString.call(this).slice(8, -1);
        };

        for (let i = types.length; i--;) {
            exports['is' + types[i]] = ((self) => (obj) => type.call(obj) === self)(types[i]);
        }

        return exports;
    },

    NAVIGATION_KEYMAP: {
        //8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    },

    // Not used
    // SPECIAL_KEYMAP: {
    //     106: '*',
    //     107: '+',
    //     109: '-',
    //     110: '.',
    //     111: '/',
    //     186: ';',
    //     187: '=',
    //     188: ',',
    //     189: '-',
    //     190: '.',
    //     191: '/',
    //     192: '`',
    //     219: '[',
    //     220: '\\',
    //     221: ']',
    //     222: '\''
    // }
});
