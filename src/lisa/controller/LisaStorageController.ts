import { Injectable } from "chevronjs";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../../chevron";
import { rootLogger } from "../../logger";
import { LisaStateStorageService } from "../service/LisaStateStorageService";
import { LisaStateController } from "./LisaStateController";

@Injectable(chevron, {
    dependencies: [LisaStateController, LisaStateStorageService]
})
class LisaStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;

    private static readonly logger = rootLogger.child({
        target: LisaStorageController
    });

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaStateStorageService: LisaStateStorageService
    ) {}

    public bindListeners(): void {
        this.lisaStateController.stateChangeSubject
            .pipe(throttleTime(LisaStorageController.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(() => this.storeState());
    }

    private storeState(): void {
        this.lisaStateStorageService
            .storeState(this.lisaStateController.getStateCopy())
            .catch(e =>
                LisaStorageController.logger.error("Could not save state!", e)
            );
    }
}

export { LisaStorageController };
