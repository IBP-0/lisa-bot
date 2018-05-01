"use strict";

const status = require("./lib/status");
const {
    randItem
} = require("lightdash");

module.exports = (args, msg, app) => {
    const statusCurrent = status.get(app);

    if (statusCurrent.isAlive) {
        const topic = randItem([
            "Leaves",
            "Grass",
            "Chlorophyll",
            "Trees",
            "Food",
            "Pizza",
            "Cuteness",
            "Memes"
        ]);

        return `Let's talk about ${topic}!`;
    }

    return "Dead plants tell no tales...";
};
