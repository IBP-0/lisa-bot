import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
import { randItem } from "lightdash";

const replantFn: commandFn = () => {
    const lisaController: LisaController = lisaChevron.get(LisaController);
    const wasAlive = lisaController.isAlive();

    lisaController.createNewLisa();

    return randItem(
        wasAlive
            ? [
                  "_Is being ripped out and thrown away while still alive, watching you plant the next lisa._"
              ]
            : [
                  "_Plants new lisa on top of the remnants of her ancestors._",
                  "_Plants the next generation of lisa._"
              ]
    );
};

const replant: IDingyCommand = {
    fn: replantFn,
    args: [],
    alias: ["reset", "plant"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Replant lisa."
    }
};

export { replant };
