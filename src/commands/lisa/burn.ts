import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { toFullName } from "di-ngy/src/util/toFullName";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { Death } from "./lib/Death";
import { LisaController } from "./lib/LisaController";

const burnFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    // noinspection SpellCheckingInspection
    return lisaController.performKill(
        toFullName(msg.author),
        Death.FIRE,
        [
            "_You hear muffled plant-screams as you set Lisa on fire_",
            "_Lisa looks at you, judging your actions._",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        ],
        ["Lisa is already dead!"]
    );
};

// noinspection SpellCheckingInspection
const burn: IDingyCommand = {
    fn: burnFn,
    args: [],
    alias: ["fire", "killitwithfire"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Burn Lisa (you monster)."
    }
};

export { burn };
