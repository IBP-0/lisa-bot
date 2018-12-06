import { Clingy } from "cli-ngy";
import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { Dingy } from "di-ngy";
import { Message } from "discord.js";

const COMMANDS = {
    foo: {
        fn: (
            args: resolvedArgumentMap,
            argsAll: string[],
            msg: Message,
            dingy: Dingy,
            clingy: Clingy
        ) => {
            setInterval(() => {
                let val = { val: Math.random() };
                console.log("SAVE", val);
                return dingy.jsonStorage.save("foo", val);
            }, 100);

            return "ok";
        },
        args: [],
        alias: [],
        data: {
            hidden: false,
            usableInDMs: true,
            powerRequired: 0,
            help: "ok"
        }
    },
    nest: {
        fn: () => "nest",
        args: [],
        alias: [],
        data: {
            hidden: false,
            usableInDMs: false,
            powerRequired: 0,
            help: "nest"
        },
        sub: {
            ed: {
                fn: () => "nested",
                args: [],
                alias: [],
                data: {
                    hidden: false,
                    usableInDMs: false,
                    powerRequired: 0,
                    help: "nested"
                }
            }
        }
    }
};

export { COMMANDS };
