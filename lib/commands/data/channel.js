"use strict";

module.exports = (args, msg, app) => {
    let channel;

    if (args.id !== null) {
        const channelResolved = app.util.resolveChannel(args.id, msg.guild);

        if (channelResolved) {
            channel = channelResolved;
        } else {
            return "ID not found";
        }
    } else {
        channel = msg.channel;
    }

    return [app.util.jsonToYaml(app.util.stripBotData(channel)), "yaml"];
};
