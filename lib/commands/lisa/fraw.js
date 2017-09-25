"use strict";

const FRAW_IDS = ["80403171238748160"];

const basicTask = require("./lib/basicTask");

module.exports = function (args, msg, app) {
    const onSucess = ["home sweet home", "Frawswin 3rd best ship"];
    const onFailure = ["You're not a fraw"];
    const onDead = ["OwO whats this? a dead Lisa..."];
    const check = FRAW_IDS.includes(msg.author.id);
    const modifier = {
        happiness: 30
    };

    return basicTask(
        msg,
        app,
        check,
        modifier,
        onSucess,
        onFailure,
        onDead
    );
};
