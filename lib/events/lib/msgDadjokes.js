"use strict";

const LEGAL_IDS = ["128985967875850240", "247036714504290305", "103878985343062016", "135492617713483778", "208301208325193729"];
const LEGAL_TEXT = /^(i am|im|i'm|ich bin)/i;

const sendMessage = require("di-ngy/lib/events/lib/sendMessage");

module.exports = function (msg, app) {
    if (LEGAL_IDS.includes(msg.author.id)) {
        const messageText = msg.content;

        if (LEGAL_TEXT.test(messageText)) {
            const text = messageText.replace(LEGAL_TEXT, "");

            sendMessage(app, msg, [`Hi${text}!`]);
        }
    }
};
