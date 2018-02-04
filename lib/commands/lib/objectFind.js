"use strict";

const { isObject, objKeys } = require("lightdash");

module.exports = (obj, fn) => {
    if (isObject(obj)) {
        const keys = objKeys(obj);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = obj[key];

            if (fn(val, key, i)) {
                return val;
            }
        }

        return false;
    } else {
        throw new TypeError("Not an object");
    }
};
