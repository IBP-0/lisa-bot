"use strict";

module.exports = (args, msg, app) => {
    let member;

    if (args.id !== null) {
        const memberResolved = app.util.resolveMember(args.id, msg.guild);

        if (memberResolved) {
            member = memberResolved;
        } else {
            return "ID not found";
        }
    } else {
        member = msg.member;
    }

    return [app.util.jsonToYaml(app.util.stripBotData(member)), "yaml"];
};
