"use strict";

const stripBotData = require("di-ngy/src/lib/util/stripBotData");
const jsonToYaml = require("di-ngy/src/lib/util/jsonToYaml");

module.exports = (args, msg) => {
    const guild = msg.guild;

    return [jsonToYaml(stripBotData(guild)), "yaml"];
};
