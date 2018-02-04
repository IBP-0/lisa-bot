"use strict";

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSuccess = [
        "_you hear muffled plant screams as you set Lisa on fire_",
        "_lisa looks at you, judging your actions_",
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    ];
    const onFailure = [];
    const onDead = ["Lisa is already dead!"];
    const check = true;
    const modifier = {
        water: -200
    };

    return basicTask(msg, app, check, modifier, onSuccess, onFailure, onDead);
};
