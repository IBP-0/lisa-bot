"use strict";

const SEPERATOR = "---";
const SPACE_BEFORE = 16;
const SPACE_AFTER = 32;

const createRpgEntry = (name, val) => {
    const valInt = parseInt(val);

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
        createRpgEntry("Vitality", id[0]),
        createRpgEntry("Strength", id[1]),
        createRpgEntry("Dexterity", id[2]),
        SEPERATOR,
        createRpgEntry("Intelligence", id[3]),
        createRpgEntry("Creativity", id[4]),
        createRpgEntry("Learning", id[5]),
        SEPERATOR,
        createRpgEntry("Charisma", id[6]),
        createRpgEntry("Humor", id[7]),
        createRpgEntry("Attractivity", id[8]),
        SEPERATOR
    ].join("\n");

module.exports = (args, msg) => {
    const paddedId = msg.author.id.padEnd(18, "0");

    return [createRpgStats(paddedId, msg.author.username), "yaml"];
};
