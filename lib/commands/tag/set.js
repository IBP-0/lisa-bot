"use strict";

const Yna = require("ynajs");

const RESERVED_KEYS = ["create", "eval", "deval", "debug", "get", "yna", "owner", "raw"];

const saveTag = (key, yna, me, tagStorage) => {
    tagStorage.setKey(key, {
        creator: me.user.id,
        content: yna.tree,
        data: {},
        uses: 0,
    });
    tagStorage.save(true);

    return `Tag '${key}' was saved.`;
};

module.exports = (args, msg, app) => {
    const tagStorage = app.dataPersisted.tag_storage;

    if (RESERVED_KEYS.includes(args.key)) {
        return "You can't save a tag under this name";
    }
    const me = msg.member;
    const yna = args.yna;

    // If no YNA was passed
    if (yna === null) {
        /* const attachments = msg.attachments;
        const arr = attachments.array();

       if (arr.length > 0) {
            const ynaFile = arr[0];

            return app.util.loadAttachment(ynaFile)
                .then(ynaFileText => {
                    return saveTag(args.key, ynaFileText, me, tagStorage);
                })
                .catch(err => {
                    app
                        .log
                        .warn("ErrorParsingFile", err);

                    return "Error parsing file";
                });
        } */

        return "No YNA code found";
    }

    return saveTag(args.key, new Yna(yna), me, tagStorage);
};
