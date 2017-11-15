"use strict";

const status = require("./status");
const score = require("./score");
const stringify = require("./stringify");
const {
    randomItem
} = require("lightdash");

module.exports = (msg, app, check, modifier, onSuccess, onFailure, onDead) => {
    const statusCurrent = status.get(app);

    if (statusCurrent.isAlive) {
        if (check) {
            const statusNew = status.modify(app, statusCurrent, modifier, msg.author.username);
            const scoreCurrent = score.get(app);

            return [randomItem(onSuccess), stringify.status(statusNew, scoreCurrent)].join("\n");
        } else {
            return randomItem(onFailure);
        }
    } else {
        return randomItem(onDead);
    }
};
