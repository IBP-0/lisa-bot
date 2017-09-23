"use strict";

const ID_CUTIE = "273221196001181697";
const LEGAL_TEXT = /^no+ u+$/i;

const sendMessage = require("di-ngy/lib/events/lib/sendMessage");

module.exports = function (msg, app) {
    if (msg.author.id === ID_CUTIE) {
        const messageText = msg.content;

        if (LEGAL_TEXT.test(messageText)) {
            sendMessage(app, msg, ["yes u"]);
        }
    }
};
