"use strict";

const member = require("../commands/member");
const nameof = require("../commands/nameof");
const save = require("../commands/save");
const user = require("../commands/user");

module.exports = (instance) => {
    instance.addCommand("member", member);
    instance.addCommand("nameof", nameof);
    instance.addCommand("save", save);
    instance.addCommand("user", user);

    return instance;
};
