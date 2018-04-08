"use strict";

module.exports = (args, msg, app) => {
    const tagStorage = app.dataPersisted.tag_storage;
    const tag = tagStorage.getKey(args.key);

    if (tag) {
        const tree = JSON.stringify(tag.content);

        return [tree, "json"];
    } else {
        return `Tag '${args.key}' not found.`;
    }
};
