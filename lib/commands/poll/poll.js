"use strict";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const ALPHABET_ICONS = ALPHABET.map(letter => {
    return {
        str: letter.toUpperCase(),
        emoji: `:regional_indicator_${letter}:`
    };
});

module.exports = function (args, msg) {
    const result = [];
    let i = 0;

    result.push(`${args.question}:`);

    while (i < args._all.length - 1 && i < ALPHABET.length) {
        const letter = ALPHABET_ICONS[i];

        result.push(`${letter.emoji}) ${args._all[i + 1]}`);

        i++;
    }

    return result.join("\n");
};
