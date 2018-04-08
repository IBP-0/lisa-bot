"use strict";

const Yna = require("ynajs");
const addDiscordCommands = require("./lib/addDiscordCommands");

module.exports = (args) => {
    const tagInstance = addDiscordCommands(new Yna(args.yna));
    const tree = JSON.stringify(tagInstance.tree);

    return [tree, "json"];
};
