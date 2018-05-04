"use strict";

const Yna = require("ynajs");
const createCtx = require("./lib/createCtx");

module.exports = (args, msg, app, cliLookup) => {
    const argsArr = cliLookup.args._all.slice(1);
    const tagInstance = new Yna(args.yna);

    return tagInstance.run(argsArr, createCtx(msg, msg.member, {}, 0, "anonymous"), {});
};
