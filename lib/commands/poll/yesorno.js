"use strict";

const YESORNO_ICONS = [
    ["Y", "🇾"],
    ["N", "🇳"],
];

const Queue = require("promise-queue");
const eachOption = require("./lib/eachOption");

module.exports = function (args) {
    const result = [];

    result.push(`${args.question}:`);
    result.push("Y/N?");

    return [result.join("\n"), false, [], {
        onSend: msg => {
            const queue = new Queue(1, 20);

            eachOption(YESORNO_ICONS, YESORNO_ICONS, (option, icon) => {
                queue.add(() => msg.react(icon[1]));
            });
        }
    }];
};
