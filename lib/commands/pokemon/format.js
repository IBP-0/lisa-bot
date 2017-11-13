"use strict";

const jsonToYaml = require("di-ngy/lib/util/jsonToYaml");

module.exports = (args, msg, app) => {
    const pokemonPokedex = app.dataPersisted.pokemon_format.getKey("data");
    const formatData = pokemonPokedex[args.name.toLowerCase()];

    if (formatData) {
        return [jsonToYaml(formatData), "yaml"];
    } else {
        return `Pokemon '${args.name}' not found.`;
    }
};
