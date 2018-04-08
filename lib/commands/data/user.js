"use strict";

module.exports = (args, msg, app) =>
    new Promise(resolve => {
        app.util
            .resolveUser(args.id, app.bot)
            .then(user => {
                const result = [
                    app.util.jsonToYaml(app.util.stripBotData(user)),
                    "yaml"
                ];

                resolve(result);
            })
            .catch(() => {
                resolve("ID not found");
            });
    });
