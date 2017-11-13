"use strict";

const resolveUser = require("di-ngy/lib/util/resolveUser");
const stripBotData = require("di-ngy/lib/util/stripBotData");
const jsonToYaml = require("di-ngy/lib/util/jsonToYaml");

module.exports = (args, msg, app) => {
    return new Promise((resolve) => {
        resolveUser(args.id, app.bot)
            .then(user => {
                const result = [jsonToYaml(stripBotData(user)), "yaml"];

                resolve(result);
            })
            .catch(() => {
                resolve("ID not found");
            });
    });
};
