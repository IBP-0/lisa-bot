"use strict";

const Yna = require("ynajs");
const createCtx = require("ynajs/lib/commands/discord/lib/createCtx");
const resolveMember = require("ynajs/lib/commands/discord/lib/resolveMember");

module.exports = function (args, msg, app, cliLookup) {
    const tagStorage = app.dataPersisted.tag_storage;
    const tag = tagStorage.getKey(args.key);

    if (tag) {
        const argsArr = cliLookup.args._all.slice(1);
        const me = resolveMember(tag.creator, msg.guild);
        const tagInstance = new Yna(tag.content, {
            loadJSON: true,
            plugins: {
                discord: true
            }
        });
        const ctx = createCtx(msg, me, tag.uses, args.key);
        let result;

        result = tagInstance.run(argsArr, ctx, {
            plugins: {
                discord: {
                    msg,
                    app
                }
            }
        });

        tag.uses++;
        tagStorage.setKey(args.key, tag);
        tagStorage.save(true);

        return result;
    } else {
        return `Tag '${args.key}' not found.`;
    }
};
