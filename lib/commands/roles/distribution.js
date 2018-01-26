"use strict";

const sortStr = require("../lib/sortStr");

module.exports = (args, msg) => {
    const roles = msg.guild.roles.array();
    const result = roles
        .sort((a, b) => b.members.array().length - a.members.array().length || sortStr(a.name, b.name))
        .map(role => `${role.name}: ${role.members.array().length}`)
        .join("\n");

    return [result, "yaml", []];
};
