"use strict";

const resolveMember = require("di-ngy/src/lib/util/legacy/resolveMember");
const toFullName = require("di-ngy/src/lib/util/legacy/toFullName");

module.exports = (args, msg, app) => {
    const tagStorage = app.dataPersisted.tag_storage;
    const tag = tagStorage.getKey(args.key);

    if (tag) {
        const me = resolveMember(tag.creator, msg.guild);

        return toFullName(me.user);
    } else {
        return `Tag '${args.key}' not found.`;
    }
};
