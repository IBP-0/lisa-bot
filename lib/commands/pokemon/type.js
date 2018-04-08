"use strict";

const objectFind = require("../lib/objectFind");

module.exports = (args, msg, app) => {
    const pokemonType =
        app.dataPersisted.pokemon_typechart.getKey("data") || {};
    const typeData = objectFind(pokemonType, (type, key) => {
        if (key.toLowerCase() === args.name.toLowerCase()) {
            return type;
        }

        return false;
    });

    if (typeData) {
        return [app.util.jsonToYaml(typeData), "yaml"];
    }

    return `Type '${args.name}' not found.`;
};
