"use strict";

module.exports = function (args, msg, app) {
    const text = [
        "Hello!",
        "I am Lisa, an indoor plant, inspired by Lisa from 'Life is Strange'.",
        "<http://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>",
        app.strings.separator,
        "For more information, use `$help` or go to <https://github.com/FelixRilling/lisa-bot>.",
        "If you have questions or want to report a bug, message my Creator: NobodyRocks#5051.",
        "Hosted by Frawst, because he could.",
        app.strings.separator
    ].join("\n");

    return [text, false, ["http://static.tumblr.com/df323b732955715fe3fb5a506999afc7/rflrqqy/H9Cnsyji6/tumblr_static_88pgfgk82y4ok80ckowwwwow4.jpg"]];
};
