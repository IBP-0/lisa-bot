"use strict";

const sortStr = require("../lib/sortStr");
const {
    isInstanceOf
} = require("lightdash");

const buildRegex = function (match, flags) {
    let result;

    try {
        result = new RegExp(match, flags);
    } catch (err) {
        return err.toString();
    }

    return result;
};

module.exports = (args, msg) => {
    const regex = buildRegex(args.match, args.flags);

    if (isInstanceOf(regex, RegExp)) {
        const members = msg.guild.members.array();
        const matching = members.filter(member => regex.test(member.displayName));

        if (args.outputLength === "false") {
            const result = matching
                .map(member => member.displayName)
                .sort(sortStr)
                .join("\n");

            return [result, "md", []];
        }

        return String(matching.length);
    }

    return regex;
};
