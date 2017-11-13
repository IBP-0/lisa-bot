"use strict";

const status = require("./lib/status");
const randomFromArray = require("../lib/randomFromArray");

module.exports = (args, msg, app) => {
    const currentStatus = status.get(app);

    if (!currentStatus.isAlive) {
        status.set(app, status._default());

        return randomFromArray(["_is being replanted_", "_you plant a clone of lisa_", "_plants new lisa on top of the remnants of her ancestors_"]);
    } else {
        return "Lisa is still alive!";
    }
};
