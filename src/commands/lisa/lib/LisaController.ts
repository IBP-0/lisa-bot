import { InjectableType } from "chevronjs";
import { IStorage } from "di-ngy/types/storage/IStorage";
import { User } from "discord.js";
import { lisaChevron, LisaDiKeys } from "../../../di";
import { ILisaData } from "./ILisaData";
import { LisaStatusService } from "./LisaStatusService";
import { LisaStringifyService } from "./LisaStringifyService";
import { randItem } from "lightdash";
import { lisaLogby } from "../../../logger";

class LisaController {

    private static readonly STORE_KEY = "lisa";
    private static readonly logger = lisaLogby.getLogger(LisaController);

    private readonly store: IStorage<any>;
    private readonly lisaStatusService: LisaStatusService;
    private readonly lisaStringifyService: LisaStringifyService;
    private lisaData: ILisaData;

    constructor(
        store: IStorage<any>,
        lisaStatusService: LisaStatusService,
        lisaStringifyService: LisaStringifyService
    ) {
        this.store = store;
        this.lisaStatusService = lisaStatusService;
        this.lisaStringifyService = lisaStringifyService;

        if (store.has(LisaController.STORE_KEY)) {
            LisaController.logger.info("Loading lisa data from store.");
            this.lisaData = store.get(LisaController.STORE_KEY);
        } else {
            LisaController.logger.info("Creating new lisa data.");
            this.lisaData = this.lisaStatusService.createNewLisa();
            this.save();
        }
    }

    public performAction(
        username: string,
        modifierWater: number,
        modifierHappiness: number,
        textSuccess: string[],
        textDead: string[]
    ): string {
        if (!this.lisaData.life.isAlive) {
            return randItem(textDead);
        }

        this.modify(username, modifierWater, modifierHappiness);

        return [randItem(textSuccess), this.stringifyStatus()].join("\n");
    }

    public modify(
        username: string,
        modifierWater: number,
        modifierHappiness: number
    ): void {
        this.lisaData = this.lisaStatusService.modify(
            this.lisaData,
            username,
            modifierWater,
            modifierHappiness
        );
        this.save();
    }

    public stringifyStatus(): string {
        return this.lisaStringifyService.stringifyStatus(this.lisaData);
    }

    public stringifyStatusShort(): string {
        return this.lisaStringifyService.stringifyStatusShort(this.lisaData);
    }

    public isAlive(): boolean {
        return this.lisaData.life.isAlive;
    }

    public createNewLisa(): void {
        this.lisaData = this.lisaStatusService.createNewLisa(this.lisaData);
        this.save();
    }

    private save() {
        this.store.set(LisaController.STORE_KEY, this.lisaData);
    }
}

lisaChevron.set(
    InjectableType.FACTORY,
    [LisaDiKeys.STORAGE, LisaStatusService, LisaStringifyService],
    LisaController
);

export { LisaController };
