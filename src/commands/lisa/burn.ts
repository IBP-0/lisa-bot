import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { toFullName } from "di-ngy";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { Death } from "./lib/Death";
import { LisaController } from "./lib/LisaController";

const burnFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    // Noinspection SpellCheckingInspection
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

// Noinspection SpellCheckingInspection
const burn: DingyCommand = {
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
