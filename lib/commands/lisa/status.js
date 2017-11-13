"use strict";

const status = require("./lib/status");
const score = require("./lib/score");
const stringify = require("./lib/stringify");

module.exports = (args, msg, app) => {
    const statusCurrent = status.get(app);
    const scoreCurrent = score.get(app);
    const statusText = stringify.status(statusCurrent, scoreCurrent);

    return statusText;
};
