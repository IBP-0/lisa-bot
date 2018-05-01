"use strict";

const {
    isObject
} = require("lightdash");

module.exports = (obj, fn) => {
    if (isObject(obj)) {
        const keys = Object.keys(obj);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = obj[key];

            if (fn(val, key, i)) {
                return val;
            }
        }

        return false;
    }

    throw new TypeError("Not an object");
};
