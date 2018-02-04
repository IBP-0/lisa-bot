"use strict";

const RAI_IDS = ["103878985343062016"];

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSuccess = ["Raice", "Raifu", "Raid", "Raisin", "Craiy", "Graiy"];
    const onFailure = ["You're not a rai uwu"];
    const onDead = ["OwO whats this? a dead Lisa..."];
    const check = RAI_IDS.includes(msg.author.id);
    const modifier = {
        happiness: 30
    };

    return basicTask(msg, app, check, modifier, onSuccess, onFailure, onDead);
};
