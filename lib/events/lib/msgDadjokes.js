"use strict";

const LEGAL_IDS = [
    "128985967875850240", //Nobo
    "247036714504290305", //Cuz
    "103878985343062016", //Rai
    "135492617713483778", //Narhwal
    "208301208325193729", //Shadow
    "158293418903076864", //Harps
    "143256091331919873", //Synex
    "149559300522639360", //Rikard
    "191010186926751744" //Undecided
];
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
