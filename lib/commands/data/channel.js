"use strict";

const stripBotData = require("di-ngy/src/lib/util/stripBotData");
const resolveChannel = require("di-ngy/src/lib/util/resolveChannel");
const jsonToYaml = require("di-ngy/src/lib/util/jsonToYaml");

module.exports = (args, msg) => {
    let channel;

    if (args.id !== null) {
        const channelResolved = resolveChannel(args.id, msg.guild);

        if (channelResolved) {
            channel = channelResolved;
        } else {
            return "ID not found";
        }
    } else {
        channel = msg.channel;
    }

    return [jsonToYaml(stripBotData(channel)), "yaml"];
};
