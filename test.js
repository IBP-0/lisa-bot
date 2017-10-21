"use strict";

const Dingy = require("di-ngy");
const commands = require("./lib/commands");
const onInit = require("./lib/events/onInit");
const onConnect = require("./lib/events/onConnect");
const onMessage = require("./lib/events/onMessage");

const config = {
    name: "lisa-bot",
    token: process.env.DISCORD_KEY_TEST,
    prefix: "$$",
    dataPersisted: {
        dir: "./data/",
        files: [
            "lisa",

            "tag_storage",

            "pokemon_abilities",
            "pokemon_items",
            "pokemon_moves",
            "pokemon_pokedex",
            "pokemon_typechart",
            "pokemon_format"
        ]
    },
    roles: [{
        name: "Admin",
        power: 10,
        assignable: false,
        check: (member) => [
            "128985967875850240", //Nobo
            "178470784984023040", //Niklas
            "236226432970391556", //Lilla
            "80403171238748160", //Fraw
            "78541183818674176", //Squas
        ].includes(member.user.id)
    }, {
        name: "User",
        power: 1,
        assignable: true,
        check: () => true
    }],
    options: {
        logLevel: "debug" //Level of log messages recommended to be either "debug" or "info", but can be any supported log-level
    }
};
const events = {
    onInit,
    onConnect,
    onMessage
};

const bot = new Dingy(config, commands, {}, events);

bot.connect();
