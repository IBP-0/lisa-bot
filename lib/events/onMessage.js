"use strict";

const status = require("../commands/lisa/lib/status");
const msgDadjokes = require("./lib/msgDadjokes");
const msgNou = require("./lib/msgNou");
//const msgNobono = require("./lib/msgNobono");

module.exports = function (msg, app) {
    if (!msg.system && !msg.author.bot) {
        const currentStatus = status.get(app);

        msgDadjokes(msg, app);
        msgNou(msg, app);
        //msgNobono(msg, app);

        //Update Lisa Happines
        status.modify(app, currentStatus, {
            happiness: 0.5
        }, "Activity");
    }
};
