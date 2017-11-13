"use strict";

const ALPHABET_ICONS = [
    ["A", "🇦"],
    ["B", "🇧"],
    ["C", "🇨"],
    ["D", "🇩"],
    ["E", "🇪"],
    ["F", "🇫"],
    ["G", "🇬"],
    ["H", "🇭"],
    ["I", "🇮"],
    ["J", "🇯"],
    ["K", "🇰"],
    ["L", "🇱"],
    ["M", "🇲"],
    ["N", "🇳"],
    ["O", "🇴"],
    ["P", "🇵"],
    ["Q", "🇶"],
    ["R", "🇷"],
    ["S", "🇸"],
    ["T", "🇹"]
];

const Queue = require("promise-queue");
const eachOption = require("./lib/eachOption");

module.exports = (args) => {
    const options = args._all.slice(1);
    const result = [];

    result.push(`${args.question}:`);

    eachOption(options, ALPHABET_ICONS, (option, icon) => {
        result.push(`${icon[0]}) ${option}`);
    });

    return [result.join("\n"), false, [], {
        onSend: msg => {
            const queue = new Queue(1, 20);

            eachOption(options, ALPHABET_ICONS, (option, icon) => {
                queue.add(() => msg.react(icon[1]));
            });
        }
    }];
};
