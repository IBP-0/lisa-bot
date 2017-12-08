"use strict";

const SEPERATOR = "---";
const SPACE_BEFORE = 16;
const SPACE_AFTER = 32;

const createRpgEntry = (name, val) => {
    const valInt = parseInt(val) + 1;

    return [
        name,
        ":" + " ".repeat(SPACE_BEFORE - name.length),
        "|".repeat(valInt * 3),
        " ".repeat(SPACE_AFTER - valInt * 3),
        valInt
    ].join("");
};

const createRpgStats = (id, username) =>
    [
        `${username}: ${id}`,
        SEPERATOR,
        createRpgEntry("Vitality", id[17]),
        createRpgEntry("Strength", id[16]),
        createRpgEntry("Dexterity", id[15]),
        SEPERATOR,
        createRpgEntry("Intelligence", id[14]),
        createRpgEntry("Creativity", id[13]),
        createRpgEntry("Learning", id[12]),
        SEPERATOR,
        createRpgEntry("Charisma", id[11]),
        createRpgEntry("Humor", id[10]),
        createRpgEntry("Attractivity", id[9]),
        SEPERATOR
    ].join("\n");

module.exports = (args, msg) => [
    createRpgStats(msg.author.id, msg.author.username),
    "yaml"
];
