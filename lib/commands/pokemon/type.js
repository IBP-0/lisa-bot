"use strict";

const objectFind = require("../lib/objectFind");
const jsonToYaml = require("di-ngy/lib/util/jsonToYaml");

module.exports = (args, msg, app) => {
    const pokemonType = app.dataPersisted.pokemon_typechart.getKey("data") || {};
    const typeData = objectFind(pokemonType, (type, key) => {
        if (key.toLowerCase() === args.name.toLowerCase()) {
            return type;
        }

        return false;
    });

    if (typeData) {
        return [jsonToYaml(typeData), "yaml"];
    } else {
        return `Type '${args.name}' not found.`;
    }
};
