import { Subject } from "rxjs";
import { LisaStorageService } from "../LisaStorageService";
import { LisaDeath, LisaDeathCause, LisaLife } from "./LisaState";
declare class LisaStateController {
    private readonly lisaStorageService;
    static readonly STORAGE_PATH = "data/lisaState.json";
    private static readonly logger;
    private static readonly STORAGE_DELAY;
    readonly stateChangeSubject: Subject<void>;
    private state;
    private readonly storeSubscription;
    constructor(lisaStorageService: LisaStorageService);
    isAlive(): boolean;
    getWater(): number;
    setWater(water: number): void;
    getHappiness(): number;
    setHappiness(happiness: number): void;
    getHighScore(): number;
    setHighScore(highScore: number): void;
    getLife(): LisaLife;
    setLife(time: Date, byUser: string): void;
    getDeath(): LisaDeath;
    setDeath(time: Date, byUser: string, cause: LisaDeathCause): void;
    storedStateExists(): Promise<boolean>;
    loadStoredState(): Promise<void>;
    private storeState;
}
export { LisaStateController };
//# sourceMappingURL=LisaStateController.d.ts.map