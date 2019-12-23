import { Subject } from "rxjs";
import { LisaStorageService } from "./service/LisaStorageService";
import { LisaDeath, LisaDeathCause, LisaLife, LisaState } from "./LisaState";
declare class LisaStateController {
    private readonly lisaStorageService;
    static readonly STORAGE_PATH = "data/lisaState.json";
    private static readonly logger;
    private static readonly STORAGE_THROTTLE_TIMEOUT;
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
    getStateCopy(): LisaState;
    storedStateExists(): Promise<boolean>;
    loadStoredState(): Promise<void>;
    private storeState;
}
export { LisaStateController };
//# sourceMappingURL=LisaStateController.d.ts.map