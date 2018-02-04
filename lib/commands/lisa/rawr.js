"use strict";

const DRAGON_IDS = [
    "236226432970391556",
    "276133054337122305",
    "262113677900120065"
];

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSuccess = [
        "OwO whats this?",
        "_nuzzles you_",
        "pointy noses are cute"
    ];
    const onFailure = ["You're not a dragon uwu"];
    const onDead = ["OwO whats this? a dead Lisa..."];
    const check = DRAGON_IDS.includes(msg.author.id);
    const modifier = {
        happiness: 30
    };

    return basicTask(msg, app, check, modifier, onSuccess, onFailure, onDead);
};
