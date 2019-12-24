import { LisaStateController } from "./LisaStateController";
import { LisaStorageService } from "./service/LisaStorageService";
declare class LisaStorageController {
    private readonly lisaStateController;
    private readonly lisaStorageService;
    private static readonly STORAGE_THROTTLE_TIMEOUT;
    private static readonly logger;
    constructor(lisaStateController: LisaStateController, lisaStorageService: LisaStorageService);
    bindListeners(): void;
}
export { LisaStorageController };
//# sourceMappingURL=LisaStorageController.d.ts.map