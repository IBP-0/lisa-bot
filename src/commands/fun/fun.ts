import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { clap } from "./clap";
import { interesting } from "./interesting";
import { rate } from "./rate";
import { roast } from "./roast";
import { rpg } from "./rpg";
import { ship } from "./ship";
import { square } from "./square";

const funFn: commandFn = () => "Respects have been paid.";

const fun: IDingyCommand = {
    fn: funFn,
    args: [],
    alias: ["f"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Misc. fun commands."
    },
    sub: { clap, interesting, rate, roast, rpg, ship, square }
};

export { fun };
