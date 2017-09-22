"use strict";

const {
    forEach,
    isUndefined,
    omit
} = require("lodash");

const BANNED_KEYS = ["eventPokemon", "spritenum"];

const isCanon = val => (isUndefined(val.isNonstandard) || val.isNonstandard === false) && (isUndefined(val.num) || val.num > 0);

module.exports = function (obj) {
    const result = {};

    forEach(obj, (val, key) => {
        if (isCanon(val)) {
            result[key] = omit(val, BANNED_KEYS);
        }
    });

    return result;
};
