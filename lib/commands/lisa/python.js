"use strict";

const PYTHON_IDS = [
    "78541183818674176",
    "80403171238748160",
    "236226432970391556"
];

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSuccess = [
        "no curly boys",
        "I'd like some semicolons please",
        "you're an awesome coder"
    ];
    const onFailure = ["You're not a python /)w(\\"];
    const onDead = ["OwO whats this? a dead Lisa..."];
    const check = PYTHON_IDS.includes(msg.author.id);
    const modifier = {
        happiness: 30
    };

    return basicTask(msg, app, check, modifier, onSuccess, onFailure, onDead);
};
