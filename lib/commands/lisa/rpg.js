"use strict";

const SEPERATOR = "---";
const SPACE_BEFORE = 14;
const SPACE_AFTER = 32;

const formatEntry = (name, val) => {
    const valInt = parseInt(val);

    return [
        name,
        ":" + " ".repeat(SPACE_BEFORE - name.length),
        "|".repeat(valInt * 3),
        " ".repeat(SPACE_AFTER - valInt * 3),
        valInt
    ].join("");
};

const reverseId = id => id.split("").reverse().slice(1);

const createRpgStats = (id, username) => {
    const stats =
        id === "273221196001181697" ? [9, 9, 9, 9, 9, 9, 9, 9, 9] :
        reverseId(id);

    return [
        `${username}: ${id}`,
        SEPERATOR,
        formatEntry("Vitality", stats[0]),
        formatEntry("Strength", stats[1]),
        formatEntry("Dexterity", stats[2]),
        SEPERATOR,
        formatEntry("Intelligence", stats[3]),
        formatEntry("Creativity", stats[4]),
        formatEntry("Learning", stats[5]),
        SEPERATOR,
        formatEntry("Charisma", stats[6]),
        formatEntry("Humor", stats[7]),
        formatEntry("Attractivity", stats[8]),
        SEPERATOR
    ].join("\n");
};

module.exports = (args, msg) => [
    createRpgStats(msg.author.id, msg.author.username),
    "yaml"
];
