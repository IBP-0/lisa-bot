"use strict";

const objectFind = require("../lib/objectFind");
const jsonToYaml = require("di-ngy/lib/util/jsonToYaml");

module.exports = (args, msg, app) => {
    const pokemonMove = app.dataPersisted.pokemon_moves.getKey("data") || {};
    const moveData = objectFind(pokemonMove, move => {
        if (move.name && (move.name.toLowerCase() === args.name.toLowerCase())) {
            return move;
        }

        return false;
    });

    if (moveData) {
        return [jsonToYaml(moveData), "yaml"];
    } else {
        return `Move '${args.name}' not found.`;
    }
};
