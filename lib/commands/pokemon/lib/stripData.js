"use strict";

const {
    forEachEntry,
    isUndefined,
} = require("lightdash");

const BANNED_KEYS = ["eventPokemon", "spritenum"];

const isCanon = val => (isUndefined(val.isNonstandard) || val.isNonstandard === false) && (isUndefined(val.num) || val.num > 0);

module.exports = function (obj) {
    const result = {};

    forEachEntry(obj, (val, key) => {
        if (isCanon(val)) {
            const pokeValNew = {};

            forEachEntry(val, (pokeVal, pokeKey) => {
                if (!BANNED_KEYS.includes(pokeKey)) {
                    pokeValNew[pokeKey] = pokeVal;
                }
            });

            result[key] = pokeValNew;
        }
    });

    return result;
};
