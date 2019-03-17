import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { toFullName } from "di-ngy/src/util/toFullName";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const waterFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    return lisaController.performAction(
        toFullName(msg.author),
        25,
        0,
        [
            "_Is being watered_",
            "_Water splashes._",
            "_Watering noises._",
            "You hear Lisa sucking up the water."
        ],
        ["It's too late to water poor Lisa..."]
    );
};

const water: IDingyCommand = {
    fn: waterFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Water Lisa."
    }
};

export { water };
