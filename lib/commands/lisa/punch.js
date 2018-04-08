"use strict";

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSuccess = [
        "_you punch lisa in the leaves_",
        "_you throw some sand at lisa_",
        "_you clip away a leaf_",
        "owww my bones hurt a lot oww oof my booones",
        "ouch ouw owie"
    ];
    const onFailure = [];
    const onDead = ["The dead feel no pain..."];
    const check = true;
    const modifier = {
        happiness: -10
    };

    return basicTask(msg, app, check, modifier, onSuccess, onFailure, onDead);
};
