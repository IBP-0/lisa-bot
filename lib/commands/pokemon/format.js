"use strict";

module.exports = (args, msg, app) => {
    const pokemonPokedex = app.dataPersisted.pokemon_format.getKey("data");
    const formatData = pokemonPokedex[args.name.toLowerCase()];

    if (formatData) {
        return [app.util.jsonToYaml(formatData), "yaml"];
    }

    return `Pokemon '${args.name}' not found.`;
};
