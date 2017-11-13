"use strict";

const sortStr = require("../lib/sortStr");

module.exports = (args, msg) => {
    const roles = msg.guild.roles.array();
    const result = roles
        .filter(role => role.members.array().length === 0)
        .map(role => role.name)
        .sort(sortStr)
        .join("\n");

    return [result, "md", []];
};
