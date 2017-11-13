"use strict";

const {
    objKeys
} = require("lightdash");

module.exports = (obj) => {
    const key = objKeys(obj)[0]; //Input has only one top-level object

    if (key.toLowerCase().startsWith("battle")) {
        const result = obj[key];

        return result;
    } else {
        return obj;
    }
};
