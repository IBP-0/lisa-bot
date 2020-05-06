import { Subject } from "rxjs";
import { LisaState } from "../LisaState";
import { JsonStorageService } from "../service/JsonStorageService";
import { StateStorageService } from "../service/StateStorageService";
declare class StateStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT;
    private static readonly STORAGE_PATH;
    private static readonly STORAGE_KEY;
    private static readonly logger;
    private readonly jsonStorageService;
    private readonly lisaStateStorageService;
    constructor(jsonStorageService: JsonStorageService, lisaStateStorageService: StateStorageService);
    bindStateChangeSubscription(stateChangeSubject: Subject<LisaState>): void;
    hasStoredState(): Promise<boolean>;
    loadStoredState(): Promise<LisaState>;
    storeState(state: LisaState): Promise<void>;
}
export { StateStorageController };
