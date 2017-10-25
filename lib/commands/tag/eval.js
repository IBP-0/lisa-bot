"use strict";

const Yna = require("ynajs");
const createCtx = require("./lib/createCtx");
const addDiscordCommands = require("./lib/addDiscordCommands");

module.exports = function (args, msg, app, cliLookup) {
    const argsArr = cliLookup.args._all.slice(1);
    const tagInstance = addDiscordCommands(new Yna(args.yna));

    return tagInstance.run(argsArr, createCtx(msg, msg.member, "anonymous", 0), {}, {
        discord: {
            msg,
            app
        }
    });
};
