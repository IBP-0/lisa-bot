import { LisaStateController } from "./LisaStateController";
import { LisaStorageService } from "./service/LisaStorageService";
declare class LisaPersistenceController {
    private readonly lisaStateController;
    private readonly lisaStorageService;
    static readonly STORAGE_PATH = "data/lisaState.json";
    private static readonly STORAGE_THROTTLE_TIMEOUT;
    private static readonly logger;
    constructor(lisaStateController: LisaStateController, lisaStorageService: LisaStorageService);
    storedStateExists(): Promise<boolean>;
    loadStoredState(): Promise<void>;
    private storeState;
}
export { LisaPersistenceController };
//# sourceMappingURL=LisaPersistenceController.d.ts.map