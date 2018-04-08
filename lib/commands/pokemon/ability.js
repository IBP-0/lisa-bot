"use strict";

const objectFind = require("../lib/objectFind");

module.exports = (args, msg, app) => {
    const pokemonAbility =
        app.dataPersisted.pokemon_abilities.getKey("data") || {};
    const abilityData = objectFind(pokemonAbility, ability => {
        if (
            ability.name &&
            ability.name.toLowerCase() === args.name.toLowerCase()
        ) {
            return ability;
        }

        return false;
    });

    if (abilityData) {
        return [app.util.jsonToYaml(abilityData), "yaml"];
    }

    return `Ability '${args.name}' not found.`;
};
