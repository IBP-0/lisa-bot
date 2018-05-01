"use strict";

const Yna = require("ynajs");
const createCtx = require("./lib/createCtx");
const addDiscordCommands = require("./lib/addDiscordCommands");

module.exports = (args, msg, app, cliLookup) => {
    const tagStorage = app.dataPersisted.tag_storage;
    const tag = tagStorage.getKey(args.key);

    if (tag) {
        const argsArr = cliLookup.args._all.slice(1);
        const me = app.util.resolveMember(tag.creator, msg.guild);
        const tagInstance = addDiscordCommands(new Yna(tag.content));
        const ctx = createCtx(msg, me, tag.data, tag.uses, args.key);
        const result = tagInstance.run(argsArr, ctx, {});

        tag.uses++;
        tagStorage.setKey(args.key, tag);
        tagStorage.save(true);

        return result;
    }

    return `Tag '${args.key}' not found.`;
};
