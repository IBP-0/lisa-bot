import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { toFullName } from "di-ngy";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";

const waterFn: CommandFn = (
    args: ResolvedArgumentMap,
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

const water: DingyCommand = {
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
