"use strict";

const core_about = require("./commands/core/about");
const core_invite = require("./commands/core/invite");
const core_dollar = require("./commands/core/dollar");
const core_a = require("./commands/core/a");

const lisa_status = require("./commands/lisa/status");
const lisa_score = require("./commands/lisa/score");
const lisa_replant = require("./commands/lisa/replant");
const lisa_water = require("./commands/lisa/water");
const lisa_burn = require("./commands/lisa/burn");
const lisa_pet = require("./commands/lisa/pet");
const lisa_hug = require("./commands/lisa/hug");
const lisa_joke = require("./commands/lisa/joke");
const lisa_punch = require("./commands/lisa/punch");
const lisa_topic = require("./commands/lisa/topic");
const lisa_meow = require("./commands/lisa/meow");
const lisa_rawr = require("./commands/lisa/rawr");
const lisa_baa = require("./commands/lisa/baa");
const lisa_awoo = require("./commands/lisa/awoo");
const lisa_python = require("./commands/lisa/python");
const lisa_cutie = require("./commands/lisa/cutie");
const lisa_gya = require("./commands/lisa/gya");
const lisa_harp = require("./commands/lisa/harp");
const lisa_rai = require("./commands/lisa/rai");
const lisa_gao = require("./commands/lisa/gao");
const lisa_fraw = require("./commands/lisa/fraw");
const lisa_niklas = require("./commands/lisa/niklas");

const tag_set = require("./commands/tag/set");
const tag_get = require("./commands/tag/get");
const tag_eval = require("./commands/tag/eval");
const tag_deval = require("./commands/tag/deval");
const tag_debug = require("./commands/tag/debug");
const tag_owner = require("./commands/tag/owner");
const tag_yna = require("./commands/tag/yna");

const roles = require("./commands/roles/roles");
const roles_distribution = require("./commands/roles/distribution");
const roles_unused = require("./commands/roles/unused");
const roles_who = require("./commands/roles/who");

const data_server = require("./commands/data/server");
const data_channel = require("./commands/data/channel");
const data_user = require("./commands/data/user");

const users_match = require("./commands/users/match");
const users_length = require("./commands/users/length");

const poll = require("./commands/poll/poll");
const poll_yesorno = require("./commands/poll/yesorno");

const pokemon = require("./commands/pokemon/pokemon");
const pokemon_ability = require("./commands/pokemon/ability");
const pokemon_item = require("./commands/pokemon/item");
const pokemon_move = require("./commands/pokemon/move");
const pokemon_type = require("./commands/pokemon/type");
const pokemon_format = require("./commands/pokemon/format");

const fun_commit = require("./commands/fun/commit");
const fun_rate = require("./commands/fun/rate");
const fun_ship = require("./commands/fun/ship");
const fun_interesting = require("./commands/fun/interesting");
const fun_roast = require("./commands/fun/roast");
const fun_clap = require("./commands/fun/clap");
const fun_square = require("./commands/fun/square");
const fun_respect = require("./commands/fun/respect");

module.exports = {
    /**
     * Core
     */
    "about": {
        fn: core_about,
        alias: ["info"],
        args: [],
        help: {
            short: "Shows info about this bot",
            long: "Shows info about this bot"
        }
    },
    "invite": {
        fn: core_invite,
        alias: ["join"],
        args: [],
        help: {
            short: "Add Lisa to your server",
            long: "Allows you to invite Lisa to your server"
        }
    },
    "$$": {
        fn: core_dollar,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "$$$",
            long: "$$$$$$"
        }
    },
    "a": {
        fn: core_a,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "AaAaAaaa",
            long: "AaAaAaaaaaaaa",
        }
    },

    /**
     * Lisa
     */
    "status": {
        fn: lisa_status,
        alias: [],
        args: [],
        help: {
            short: "Show how Lisa is doing",
            long: "Show how Lisa is doing"
        }
    },
    "score": {
        fn: lisa_score,
        alias: [],
        args: [],
        help: {
            short: "Show Lisa's score",
            long: "Show Lisa's score"
        }
    },

    "water": {
        fn: lisa_water,
        alias: ["watah"],
        args: [],
        help: {
            short: "Water Lisa",
            long: "Water Lisa"
        }
    },

    "pet": {
        fn: lisa_pet,
        alias: ["pat"],
        args: [],
        help: {
            short: "Pet Lisa",
            long: "Pet Lisa"
        }
    },
    "hug": {
        fn: lisa_hug,
        alias: ["snug"],
        args: [],
        help: {
            short: "Hug Lisa",
            long: "Hug Lisa"
        }
    },
    "joke": {
        fn: lisa_joke,
        alias: ["pun"],
        args: [],
        help: {
            short: "Tell Lisa a joke",
            long: "Tell Lisa a joke"
        }
    },
    "burn": {
        fn: lisa_burn,
        alias: ["fire", "killitwithfire"],
        args: [],
        help: {
            short: "Burn...Lisa?",
            long: "Burn...Lisa? (you monster)"
        }
    },
    "replant": {
        fn: lisa_replant,
        alias: ["respawn"],
        args: [],
        help: {
            short: "Replant Lisa",
            long: "Replant Lisa"
        }
    },
    "punch": {
        fn: lisa_punch,
        alias: ["cut"],
        args: [],
        hidden: true,
        help: {
            short: "Punch Lisa",
            long: "Punch Lisa"
        }
    },
    "topic": {
        fn: lisa_topic,
        alias: ["conversation"],
        args: [],
        hidden: true,
        help: {
            short: "Let Lisa decide the topic",
            long: "Let Lisa decide the topic"
        }
    },
    "meow": {
        fn: lisa_meow,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "Meow",
            long: "Meow"
        }
    },
    "rawr": {
        fn: lisa_rawr,
        alias: ["owo"],
        args: [],
        hidden: true,
        help: {
            short: "Rawr",
            long: "Rawr ;^)"
        }
    },
    "baa": {
        fn: lisa_baa,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "Baa",
            long: "Baaaaa~"
        }
    },
    "awoo": {
        fn: lisa_awoo,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "Awoo",
            long: "Awooooo~"
        }
    },
    "cutie": {
        fn: lisa_cutie,
        alias: ["miso"],
        args: [],
        hidden: true,
        help: {
            short: "<3",
            long: "<3"
        }
    },
    "gya": {
        fn: lisa_gya,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "gya",
            long: "mega gyarados"
        }
    },
    "python": {
        fn: lisa_python,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: ";",
            long: ";"
        }
    },
    "rai": {
        fn: lisa_rai,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "Rai",
            long: "Rai"
        }
    },
    "harp": {
        fn: lisa_harp,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "harp",
            long: "harp"
        }
    },
    "gao": {
        fn: lisa_gao,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "GAO",
            long: "GAO"
        }
    },
    "niklas": {
        fn: lisa_niklas,
        alias: [],
        args: [],
        hidden: true,
        help: {
            short: "baa",
            long: "baaaaaaaaaaaa"
        }
    },
    "fraw": {
        fn: lisa_fraw,
        alias: ["frawst"],
        args: [],
        hidden: true,
        help: {
            short: "fraw",
            long: "frawww"
        }
    },

    /**
     * Tags
     */
    "tag": {
        fn: tag_get,
        alias: ["t"],
        args: [{
            name: "key",
            required: true,
            help: "Tag name"
        }, {
            name: "args",
            required: false,
            default: "",
            help: "args"
        }],
        help: {
            short: "Tag commands",
            long: "Tag commands; Loads a tag stored in the bots db"
        },
        sub: {
            "set": {
                fn: tag_set,
                alias: ["create"],
                args: [{
                    name: "key",
                    required: true,
                    help: "Tag name"
                }, {
                    name: "yna",
                    required: false,
                    default: null,
                    help: "YNA Code"
                }],
                help: {
                    short: "Saves a tag",
                    long: "Saves a tag to the bots db"
                }
            },
            "eval": {
                fn: tag_eval,
                alias: [],
                args: [{
                    name: "yna",
                    required: true,
                    help: "YNA Code"
                }, {
                    name: "args",
                    required: false,
                    default: "",
                    help: "args"
                }],
                help: {
                    short: "Evaluates YNA",
                    long: "Evaluates YNA"
                }

            },
            "deval": {
                fn: tag_deval,
                alias: [],
                args: [{
                    name: "yna",
                    required: true,
                    help: "YNA Code"
                }],
                help: {
                    short: "Evaluates and debugs YNA",
                    long: "Evaluates and debugs YNA"
                }
            },
            "debug": {
                fn: tag_debug,
                alias: ["tree"],
                args: [{
                    name: "key",
                    required: true,
                    help: "Tag name"
                }],
                help: {
                    short: "Gets the parsed code of a tag",
                    long: "Gets the parsed code of a tag"
                }
            },
            "owner": {
                fn: tag_owner,
                alias: [],
                args: [{
                    name: "key",
                    required: true,
                    help: "Tag name"
                }],
                help: {
                    short: "Retrieves the owner of a tag",
                    long: "Retrieves the owner of a tag"
                }
            },
            "yna": {
                fn: tag_yna,
                alias: ["help", "info", "na", "about"],
                args: [],
                help: {
                    short: "Displays Info about YNA",
                    long: "Displays Info about YNA"
                }
            }
        }
    },

    /**
     * Roles
     */
    "roles": {
        fn: roles,
        alias: ["role"],
        args: [],
        help: {
            short: "Role commands",
            long: "Role commands; Shows list of roles"
        },
        sub: {
            "distribution": {
                fn: roles_distribution,
                alias: ["size"],
                args: [],
                help: {
                    short: "Shows distribution of roles",
                    long: "Shows distribution of roles"
                }
            },
            "unused": {
                fn: roles_unused,
                alias: ["redundant"],
                args: [],
                help: {
                    short: "Shows unused of roles",
                    long: "Shows unused of roles"
                }
            },
            "who": {
                fn: roles_who,
                alias: ["users"],
                args: [{
                    name: "name",
                    required: true,
                    help: "Username to filter"
                }],
                help: {
                    short: "Shows members of a role",
                    long: "Shows members of a role"
                }
            }
        }
    },

    "data": {
        fn: data_user,
        alias: ["search", "id"],
        args: [{
            name: "id",
            required: false,
            default: null,
            help: "User ID"
        }],
        help: {
            short: "Data commands",
            long: "Data commands; Dumps user data"
        },
        sub: {
            "server": {
                fn: data_server,
                alias: ["guild"],
                args: [],
                help: {
                    short: "Dumps server data",
                    long: "Dumps server data"
                }
            },
            "channel": {
                fn: data_channel,
                alias: [],
                args: [{
                    name: "id",
                    required: false,
                    default: null,
                    help: "Channel ID"
                }],
                help: {
                    short: "Dumps channel data",
                    long: "Dumps channel data"
                }
            }
        }
    },

    "users": {
        fn: users_match,
        alias: ["user", "member", "members"],
        args: [{
            name: "match",
            required: true,
            help: "Regex to match"
        }, {
            name: "flags",
            required: false,
            default: "",
            help: "Regex flags"
        }, {
            name: "outputLength",
            required: false,
            default: "false",
            help: "If only the length of results should be returned"
        }],
        help: {
            short: "User-search commands",
            long: "User-search commands; Matches users by regex"
        },
        sub: {
            "length": {
                fn: users_length,
                alias: ["size"],
                args: [{
                    name: "op",
                    required: true,
                    help: "Operation (eq,ne,gt,lt)"
                }, {
                    name: "length",
                    required: true,
                    help: "Length so search"
                }, {
                    name: "outputLength",
                    required: false,
                    default: "false",
                    help: "If only the length of results should be returned"
                }],
                help: {
                    short: "Matches users with length",
                    long: "Matches users with length"
                }
            }
        }
    },

    "poll": {
        fn: poll,
        alias: ["vote"],
        args: [{
            name: "question",
            required: true,
            help: "Question"
        }, {
            name: "option1",
            required: true,
            help: "Option 1"
        }, {
            name: "option2",
            required: true,
            help: "Option 2"
        }],
        help: {
            short: "Creates a poll to vote on",
            long: "Creates a poll to vote on; Takes any number of option"
        },
        sub: {
            "yesorno": {
                fn: poll_yesorno,
                alias: ["y/n"],
                args: [{
                    name: "question",
                    required: true,
                    help: "Question"
                }, {
                    name: "option1",
                    required: true,
                    help: "Option 1"
                }, {
                    name: "option2",
                    required: true,
                    help: "Option 2"
                }],
                help: {
                    short: "Creates a poll with yes and no as answer",
                    long: "Creates a poll with yes and no as answer"
                }
            }
        }
    },


    /**
     * Pokemon
     */
    "pokemon": {
        fn: pokemon,
        alias: ["p", "poke", "dex"],
        args: [{
            name: "name",
            required: true,
            help: "Pokemon name"
        }],
        help: {
            short: "Pokemon commands",
            long: "Pokemon commands; Searches Pokemon by name"
        },
        sub: {
            "ability": {
                fn: pokemon_ability,
                alias: [],
                args: [{
                    name: "name",
                    required: true,
                    help: "Ability name"
                }],
                help: {
                    short: "Searches Ability by name",
                    long: "Searches Ability by name"
                }
            },
            "item": {
                fn: pokemon_item,
                alias: [],
                args: [{
                    name: "name",
                    required: true,
                    help: "Item name"
                }],
                help: {
                    short: "Searches Item by name",
                    long: "Searches Item by name"
                }
            },
            "move": {
                fn: pokemon_move,
                alias: ["attack"],
                args: [{
                    name: "name",
                    required: true,
                    help: "Move name"
                }],
                help: {
                    short: "Searches Move by name",
                    long: "Searches Move by name"
                }
            },
            "type": {
                fn: pokemon_type,
                alias: ["weak", "effective"],
                args: [{
                    name: "name",
                    required: true,
                    help: "Type name"
                }],
                help: {
                    short: "Searches Type by name",
                    long: "Searches Type by name"
                }
            },
            "format": {
                fn: pokemon_format,
                alias: ["rate", "rating", "comp"],
                args: [{
                    name: "name",
                    required: true,
                    help: "Pokemon name"
                }],
                help: {
                    short: "Shows comp data by name",
                    long: "Shows comp data by name"
                }
            }
        }
    },

    /**
     * Fun
     */
    "fun": {
        fn: fun_respect,
        alias: ["f"],
        args: [],
        help: {
            short: "Misc. joke commands",
            long: "Misc. joke commands; Pay respects"
        },
        sub: {
            "rate": {
                fn: fun_rate,
                alias: [],
                args: [{
                    name: "thing",
                    required: true,
                    help: "Thing to rate"
                }],
                help: {
                    short: "Rates something",
                    long: "Rates something from 1 to 10"
                }
            },
            "ship": {
                fn: fun_ship,
                alias: ["fuse"],
                args: [{
                    name: "person1",
                    required: true,
                    help: "Person 1"
                }, {
                    name: "person2",
                    default: "Nothing",
                    required: false,
                    help: "Person 2"
                }],
                help: {
                    short: "Ships people",
                    long: "Ships person 1 with person 2"
                }
            },
            "roast": {
                fn: fun_roast,
                alias: ["roasted"],
                args: [{
                    name: "thing",
                    required: true,
                    help: "Thing to roast"
                }],
                help: {
                    short: "Roast a person",
                    long: "Roast a person"
                }
            },
            "interesting": {
                fn: fun_interesting,
                alias: [],
                args: [],
                hidden: true,
                help: {
                    short: "Declare something for interesting",
                    long: "Declare something for interesting"
                }
            },
            "square": {
                fn: fun_square,
                alias: ["squares"],
                args: [{
                    name: "text",
                    required: true,
                    help: "Text to square"
                }],
                help: {
                    short: "Output a text as square",
                    long: "Output a text as square"
                }
            },
            "clap": {
                fn: fun_clap,
                alias: ["clapifier"],
                args: [{
                    name: "text",
                    required: true,
                    help: "Text to clap"
                }],
                help: {
                    short: "Output a text clapped",
                    long: "Output a text clapped"
                }
            },
            "commit": {
                fn: fun_commit,
                alias: [],
                args: [],
                help: {
                    short: "Shows a commit message",
                    long: "Shows a commit message"
                }
            }
        }
    },
};
