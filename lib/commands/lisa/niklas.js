"use strict";

const NIKLAS_ID = ["178470784984023040"];

const basicTask = require("./lib/basicTask");

module.exports = function (args, msg, app) {
    const onSucess = ["Niklaaaaas"];
    const onFailure = ["You're not a niklas"];
    const onDead = ["OwO whats this? a dead Lisa..."];
    const check = NIKLAS_ID.includes(msg.author.id);
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
