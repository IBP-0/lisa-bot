"use strict";

const resolveMember = require("di-ngy/lib/util/resolveMember");
const toFullName = require("di-ngy/lib/util/toFullName");

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
