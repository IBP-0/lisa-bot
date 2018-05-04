"use strict";

const Yna = require("ynajs");

module.exports = (args) => {
    const tagInstance = new Yna(args.yna);
    const tree = JSON.stringify(tagInstance.tree, null, "  ");

    return [tree, "json"];
};
