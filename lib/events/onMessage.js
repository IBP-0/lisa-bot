"use strict";

const status = require("../commands/lisa/lib/status");

module.exports = function (msg, app) {
    if (!msg.system && !msg.author.bot) {
        const currentStatus = status.get(app);

        //Update Lisa Happiness
        status.modify(app, currentStatus, {
            happiness: 0.5
        }, "Activity");
    }
};
