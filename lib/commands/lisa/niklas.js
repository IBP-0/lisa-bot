"use strict";

const NIKLAS_ID = ["178470784984023040"];

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSuccess = ["Niklaaaaas"];
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
        onSuccess,
        onFailure,
        onDead
    );
};
