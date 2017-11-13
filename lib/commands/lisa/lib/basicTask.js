"use strict";

const status = require("./status");
const score = require("./score");
const stringify = require("./stringify");
const randomFromArray = require("../../lib/randomFromArray");

module.exports = (msg, app, check, modifier, onSuccess, onFailure, onDead) => {
    const statusCurrent = status.get(app);

    if (statusCurrent.isAlive) {
        if (check) {
            const statusNew = status.modify(app, statusCurrent, modifier, msg.author.username);
            const scoreCurrent = score.get(app);

            return [randomFromArray(onSuccess), stringify.status(statusNew, scoreCurrent)].join("\n");
        } else {
            return randomFromArray(onFailure);
        }
    } else {
        return randomFromArray(onDead);
    }
};
