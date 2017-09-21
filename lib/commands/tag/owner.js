"use strict";

const resolveMember = require("ynajs/lib/commands/plugins/discord/lib/resolveMember");
const toFullName = require("ynajs/lib/commands/plugins/discord/lib/toFullName");

module.exports = function (args, msg, app) {
    const tagStorage = app.dataPersisted.tag_storage;
    const tag = tagStorage.getKey(args.key);

    if (tag) {
        const me = resolveMember(tag.creator, msg.guild);

        return toFullName(me.user);
    } else {
        return `Tag '${args.key}' not found.`;
    }
};
