"use strict";

const CHANCE_DADJOKES = 1;
const CHANCE_NOU = 1;
const CHANCE_VERYCUTE = 1;
const CHANCE_NOBONO = 1;

const isActive = chance => Math.random() < chance;

const status = require("../commands/lisa/lib/status");
const msgDadjokes = require("./lib/msgDadjokes");
const msgNou = require("./lib/msgNou");
const msgVerycute = require("./lib/msgVerycute");
const msgNobono = require("./lib/msgNobono");

module.exports = function (msg, app) {
    if (!msg.system && !msg.author.bot) {
        const currentStatus = status.get(app);

        if (isActive(CHANCE_DADJOKES)) {
            msgDadjokes(msg, app);
        }
        if (isActive(CHANCE_NOU)) {
            msgNou(msg, app);
        }
        if (isActive(CHANCE_VERYCUTE)) {
            msgVerycute(msg, app);
        }
        if (isActive(CHANCE_NOBONO)) {
            msgNobono(msg, app);
        }

        //Update Lisa Happines
        status.modify(app, currentStatus, {
            happiness: 0.5
        }, "Activity");
    }
};
