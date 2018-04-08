"use strict";

const getUniqueStringNumber = require("./lib/getUniqueStringNumber");

const rateName = name => {
    const nameLower = name.toLowerCase();
    const rating = getUniqueStringNumber(nameLower); //Generates a number from 0 to 10 for this name

    return `${name} is a solid ${rating}/10.`;
};

module.exports = args => rateName(args.thing);
