"use strict";

const CAT_IDS = ["133655732187824128", "168558770958499850", "208301208325193729", "273221196001181697", "61820365495603200", "262113677900120065"];

const basicTask = require("./lib/basicTask");

module.exports = (args, msg, app) => {
    const onSuccess = ["_meow_", "aaaaaaaaaaa", "_meows in japanese_", "_does cute things_"];
    const onFailure = ["You're not a cat >_>"];
    const onDead = ["Dead plants can't meow"];
    const check = CAT_IDS.includes(msg.author.id);
    const modifier = {
        happiness: 30
    };

    return basicTask(
        msg,
        app,
        check,
        modifier,
        onSuccess,
        onFailure,
        onDead
    );
};
