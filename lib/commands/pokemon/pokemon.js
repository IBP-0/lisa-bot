"use strict";

const objectFind = require("../lib/objectFind");
const jsonToYaml = require("di-ngy/lib/util/jsonToYaml");

module.exports = (args, msg, app) => {
    const pokemonPokedex = app.dataPersisted.pokemon_pokedex.getKey("data");
    const pokemonData = objectFind(pokemonPokedex, pokemon => {
        if (
            pokemon.species && (pokemon.species.toLowerCase() === args.name.toLowerCase()) ||
            pokemon.num && (pokemon.num === Number(args.name))
        ) {
            return pokemon;
        }

        return false;
    });

    if (pokemonData) {
        return [jsonToYaml(pokemonData), "yaml"];
    } else {
        return `Pokemon '${args.name}' not found.`;
    }
};
