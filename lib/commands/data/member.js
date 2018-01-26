"use strict";

const resolveMember = require("di-ngy/src/lib/util/resolveMember");
const stripBotData = require("di-ngy/src/lib/util/stripBotData");
const jsonToYaml = require("di-ngy/src/lib/util/jsonToYaml");

module.exports = (args, msg) => {
    let member;

    if (args.id !== null) {
        const memberResolved = resolveMember(args.id, msg.guild);

        if (memberResolved) {
            member = memberResolved;
        } else {
            return "ID not found";
        }
    } else {
        member = msg.member;
    }

    return [jsonToYaml(stripBotData(member)), "yaml"];
};
