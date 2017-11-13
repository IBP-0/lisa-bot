"use strict";

const resolveMember = require("di-ngy/lib/util/resolveMember");
const stripBotData = require("di-ngy/lib/util/stripBotData");
const jsonToYaml = require("di-ngy/lib/util/jsonToYaml");

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
