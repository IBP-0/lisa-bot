"use strict";

const objectFind = require("../lib/objectFind");
const jsonToYaml = require("di-ngy/lib/util/jsonToYaml");

module.exports = (args, msg, app) => {
    const pokemonItem = app.dataPersisted.pokemon_items.getKey("data") || {};
    const itemData = objectFind(pokemonItem, item => {
        if (item.name && (item.name.toLowerCase() === args.name.toLowerCase())) {
            return item;
        }

        return false;
    });

    if (itemData) {
        return [jsonToYaml(itemData), "yaml"];
    } else {
        return `Item '${args.name}' not found.`;
    }
};
