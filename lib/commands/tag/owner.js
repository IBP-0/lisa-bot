"use strict";

module.exports = (args, msg, app) => {
    const tagStorage = app.dataPersisted.tag_storage;
    const tag = tagStorage.getKey(args.key);

    if (tag) {
        const me = app.util.resolveMember(tag.creator, msg.guild);

        return app.util.toFullName(me.user);
    } else {
        return `Tag '${args.key}' not found.`;
    }
};
