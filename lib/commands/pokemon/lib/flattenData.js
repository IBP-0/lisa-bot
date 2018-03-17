"use strict";

module.exports = obj => {
    const key = Object.keys(obj)[0]; // Input has only one top-level object

    if (key.toLowerCase().startsWith("battle")) {
        const result = obj[key];

        return result;
    }

    return obj;
};
