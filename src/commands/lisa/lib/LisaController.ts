import { InjectableType } from "chevronjs";
import { IStorage } from "di-ngy/types/storage/IStorage";
import { User } from "discord.js";
import { lisaChevron, LisaDiKeys } from "../../../di";
import { Deaths } from "./Deaths";
import { ILisaData } from "./ILisaData";
import { LisaStatusService } from "./LisaStatusService";
import { LisaStringifyService } from "./LisaStringifyService";

class LisaController {
    private static readonly STORE_KEY = "lisa";

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
            this.lisaData = store.get(LisaController.STORE_KEY);
        } else {
            this.lisaData = LisaController.createNewLisa();
        }
    }

    private static createNewLisa(): ILisaData {
        return {
            status: {
                water: 100,
                happiness: 100
            },
            life: {
                isAlive: true,
                killer: "Anonymous",
                deathThrough: Deaths.UNKNOWN,
                birth: Date.now(),
                death: 0
            },
            score: {
                highScore: 0
            }
        };
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
        this.store.set(LisaController.STORE_KEY, this.lisaData);
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

    public reset(): void {
        this.lisaData = LisaController.createNewLisa();
    }
}

lisaChevron.set(
    InjectableType.FACTORY,
    [LisaDiKeys.STORAGE, LisaStatusService, LisaStringifyService],
    LisaController
);

export { LisaController };
