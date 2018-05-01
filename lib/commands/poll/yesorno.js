"use strict";

const YESORNO_ICONS = [
    ["Y", "🇾"],
    ["N", "🇳"]
];

const Queue = require("promise-queue");
const eachOption = require("./lib/eachOption");

module.exports = (args, msg, app) => {
    const result = [];

    result.push(`${args.question}`, app.strings.separator);
    result.push("Y/N?");

    return [
        result.join("\n"),
        "yaml", [],
        {
            onSend: msg => {
                const queue = new Queue(1, 20);

                eachOption(YESORNO_ICONS, YESORNO_ICONS, (option, icon) => {
                    queue.add(() => msg.react(icon[1]));
                });
            }
        }
    ];
};
