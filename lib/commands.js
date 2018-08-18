"use strict";

const core_about = require("./commands/core/about");
const core_invite = require("./commands/core/invite");

const lisa_status = require("./commands/lisa/status");
const lisa_score = require("./commands/lisa/score");
const lisa_replant = require("./commands/lisa/replant");
const lisa_water = require("./commands/lisa/water");
const lisa_burn = require("./commands/lisa/burn");
const lisa_pet = require("./commands/lisa/pet");
const lisa_hug = require("./commands/lisa/hug");
const lisa_punch = require("./commands/lisa/punch");
const lisa_meow = require("./commands/lisa/meow");
const lisa_baa = require("./commands/lisa/baa");
const lisa_niklas = require("./commands/lisa/niklas");
const lisa_joke = require("./commands/lisa/joke");
const lisa_topic = require("./commands/lisa/topic");
const lisa_rpg = require("./commands/lisa/rpg");

const roles = require("./commands/roles/roles");
const roles_distribution = require("./commands/roles/distribution");
const roles_unused = require("./commands/roles/unused");
const roles_who = require("./commands/roles/who");

const data_server = require("./commands/data/server");
const data_channel = require("./commands/data/channel");
const data_member = require("./commands/data/member");
const data_user = require("./commands/data/user");

const users_match = require("./commands/users/match");

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
    about: {
        fn: core_about,
        alias: ["info"],
        usableInDMs: true,
        help: {
            short: "Shows info about this bot"
        }
    },
    invite: {
        fn: core_invite,
        alias: ["join"],
        usableInDMs: true,
        help: {
            short: "Add Lisa to your server",
            long: "Allows you to invite Lisa to your server"
        }
    },

    /**
     * Lisa
     */
    status: {
        fn: lisa_status,
        help: {
            short: "Show how Lisa is doing"
        }
    },
    score: {
        fn: lisa_score,
        help: {
            short: "Show Lisa's score"
        }
    },
    water: {
        fn: lisa_water,
        alias: [],
        help: {
            short: "Water Lisa"
        }
    },
    pet: {
        fn: lisa_pet,
        alias: ["pat"],
        help: {
            short: "Pet Lisa"
        }
    },
    hug: {
        fn: lisa_hug,
        alias: ["snug"],
        help: {
            short: "Hug Lisa"
        }
    },
    burn: {
        fn: lisa_burn,
        alias: ["fire", "killitwithfire"],
        help: {
            short: "Burn...Lisa?",
            long: "Burn...Lisa? (you monster)"
        }
    },
    replant: {
        fn: lisa_replant,
        alias: ["respawn"],
        help: {
            short: "Replant Lisa"
        }
    },
    punch: {
        fn: lisa_punch,
        alias: ["cut"],
        hidden: true,
        help: {
            short: "Punch Lisa"
        }
    },
    meow: {
        fn: lisa_meow,
        hidden: true,
        help: {
            short: "Meow"
        }
    },
    baa: {
        fn: lisa_baa,
        hidden: true,
        help: {
            short: "Baa",
            long: "Baaaaa~"
        }
    },
    niklas: {
        fn: lisa_niklas,
        hidden: true,
        help: {
            short: "baa",
            long: "baaaaaaaaaaaa"
        }
    },
    topic: {
        fn: lisa_topic,
        alias: ["conversation"],
        hidden: true,
        help: {
            short: "Let Lisa decide the topic"
        }
    },
    joke: {
        fn: lisa_joke,
        alias: ["pun"],
        help: {
            short: "Tell Lisa a joke"
        }
    },
    rpg: {
        fn: lisa_rpg,
        alias: ["game"],
        hidden: true,
        help: {
            short: "Let lisa start an RPG with you"
        }
    },

    /**
     * Roles
     */
    roles: {
        fn: roles,
        alias: ["role", "r"],
        help: {
            short: "Role commands",
            long: "Role commands; Shows list of roles"
        },
        sub: {
            distribution: {
                fn: roles_distribution,
                alias: ["size"],
                help: {
                    short: "Shows distribution of roles"
                }
            },
            unused: {
                fn: roles_unused,
                alias: ["redundant"],
                help: {
                    short: "Shows unused of roles"
                }
            },
            who: {
                fn: roles_who,
                alias: ["users"],
                args: [
                    {
                        name: "name",
                        required: true,
                        help: "Username to filter"
                    }
                ],
                help: {
                    short: "Shows members of a role"
                }
            }
        }
    },

    /**
     * Data
     */
    data: {
        fn: data_member,
        alias: ["d"],
        args: [
            {
                name: "id",
                required: false,
                default: null,
                help: "Member resolveable"
            }
        ],
        help: {
            short: "Data commands",
            long: "Data commands; Dumps member data"
        },
        sub: {
            server: {
                fn: data_server,
                alias: ["guild"],
                help: {
                    short: "Dumps server data"
                }
            },
            channel: {
                fn: data_channel,
                args: [
                    {
                        name: "id",
                        required: false,
                        default: null,
                        help: "Channel resolveable"
                    }
                ],
                help: {
                    short: "Dumps channel data"
                }
            },
            user: {
                fn: data_user,
                args: [
                    {
                        name: "id",
                        required: true,
                        help: "User ID"
                    }
                ],
                help: {
                    short: "Dumps user data"
                }
            }
        }
    },

    /**
     * Users
     */
    users: {
        fn: users_match,
        alias: ["user", "member", "members", "u"],
        args: [
            {
                name: "match",
                required: true,
                help: "Regex to match"
            },
            {
                name: "flags",
                required: false,
                default: "",
                help: "Regex flags"
            },
            {
                name: "outputLength",
                required: false,
                default: "false",
                help: "If only the length of results should be returned"
            }
        ],
        help: {
            short: "User-search commands",
            long: "User-search commands; Matches users by regex"
        }
    },

    /**
     * Poll
     */
    poll: {
        fn: poll,
        alias: ["vote", "v"],
        args: [
            {
                name: "question",
                required: true,
                help: "Question"
            },
            {
                name: "option1",
                required: true,
                help: "Option 1"
            },
            {
                name: "option2",
                required: true,
                help: "Option 2"
            }
        ],
        help: {
            short: "Creates a poll to vote on",
            long: "Creates a poll to vote on; Takes up to 20 options"
        },
        sub: {
            yesorno: {
                fn: poll_yesorno,
                alias: ["y/n"],
                args: [
                    {
                        name: "question",
                        required: true,
                        help: "Question"
                    }
                ],
                help: {
                    short: "Creates a poll with yes and no as answer"
                }
            }
        }
    },

    /**
     * Pokemon
     */
    pokemon: {
        fn: pokemon,
        alias: ["p", "poke", "dex"],
        args: [
            {
                name: "name",
                required: true,
                help: "Pokemon name"
            }
        ],
        usableInDMs: true,
        help: {
            short: "Pokemon commands",
            long: "Pokemon commands; Searches Pokemon by name"
        },
        sub: {
            ability: {
                fn: pokemon_ability,
                args: [
                    {
                        name: "name",
                        required: true,
                        help: "Ability name"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Searches Ability by name"
                }
            },
            item: {
                fn: pokemon_item,
                args: [
                    {
                        name: "name",
                        required: true,
                        help: "Item name"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Searches Item by name"
                }
            },
            move: {
                fn: pokemon_move,
                alias: ["attack"],
                args: [
                    {
                        name: "name",
                        required: true,
                        help: "Move name"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Searches Move by name"
                }
            },
            type: {
                fn: pokemon_type,
                alias: ["weak", "effective"],
                args: [
                    {
                        name: "name",
                        required: true,
                        help: "Type name"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Searches Type by name"
                }
            },
            format: {
                fn: pokemon_format,
                alias: ["rate", "rating", "comp"],
                args: [
                    {
                        name: "name",
                        required: true,
                        help: "Pokemon name"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Shows comp data by name"
                }
            }
        }
    },

    /**
     * Fun
     */
    fun: {
        fn: fun_respect,
        alias: ["f"],
        help: {
            short: "Misc. joke commands",
            long: "Misc. joke commands; Pay respects"
        },
        sub: {
            rate: {
                fn: fun_rate,
                args: [
                    {
                        name: "thing",
                        required: true,
                        help: "Thing to rate"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Rates something",
                    long: "Rates something from 1 to 10"
                }
            },
            ship: {
                fn: fun_ship,
                alias: ["fuse"],
                args: [
                    {
                        name: "person1",
                        required: true,
                        help: "Person 1"
                    },
                    {
                        name: "person2",
                        default: "Nothing",
                        required: false,
                        help: "Person 2"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Ships people",
                    long: "Ships person 1 with person 2"
                }
            },
            roast: {
                fn: fun_roast,
                alias: ["roasted"],
                args: [
                    {
                        name: "thing",
                        required: true,
                        help: "Thing to roast"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Roast a person"
                }
            },
            interesting: {
                fn: fun_interesting,
                hidden: true,
                usableInDMs: true,
                help: {
                    short: "Declare something for interesting"
                }
            },
            square: {
                fn: fun_square,
                alias: ["squares"],
                args: [
                    {
                        name: "text",
                        required: true,
                        help: "Text to square"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Output a text as square"
                }
            },
            clap: {
                fn: fun_clap,
                alias: ["clapifier"],
                args: [
                    {
                        name: "text",
                        required: true,
                        help: "Text to clap"
                    }
                ],
                usableInDMs: true,
                help: {
                    short: "Output a text clapped"
                }
            },
            commit: {
                fn: fun_commit,
                usableInDMs: true,
                help: {
                    short: "Shows a commit message"
                }
            }
        }
    }
};
