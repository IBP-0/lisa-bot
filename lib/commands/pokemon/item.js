"use strict";

const objectFind = require("../lib/objectFind");

module.exports = (args, msg, app) => {
    const pokemonItem = app.dataPersisted.pokemon_items.getKey("data") || {};
    const itemData = objectFind(pokemonItem, item => {
        if (item.name && (item.name.toLowerCase() === args.name.toLowerCase())) {
            return item;
        }

        return false;
    });

    if (itemData) {
        return [app.util.jsonToYaml(itemData), "yaml"];
    } else {
        return `Item '${args.name}' not found.`;
    }
};
