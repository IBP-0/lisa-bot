"use strict";

const sortStr = require("../lib/sortStr");

module.exports = (args, msg) => {
    const roles = msg.guild.roles.array();
    const role = roles.find(role => role.name === args.name);

    if (role) {
        const members = role.members.array();
        const result = members
            .map(member => member.displayName)
            .sort(sortStr)
            .join("\n");

        return [result, "yaml", []];
    } else {
        return "Role not found";
    }
};
