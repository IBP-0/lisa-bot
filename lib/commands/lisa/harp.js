"use strict";

const HARP_IDS = ["158293418903076864"];

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSucess = ["https://how-about-th.at/329c5a.png"];
    const onFailure = ["You're not a harp >_>"];
    const onDead = ["Dead plants can't harp"];
    const check = HARP_IDS.includes(msg.author.id);
    const modifier = {
        happiness: 30
    };

    return basicTask(
        msg,
        app,
        check,
        modifier,
        onSucess,
        onFailure,
        onDead
    );
};
