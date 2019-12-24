import { DefaultBootstrappings, Injectable } from "chevronjs";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
import { LisaStorageService } from "./service/LisaStorageService";

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStateController, LisaStorageService]
})
class LisaStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;

    private static readonly logger = rootLogger.child({
        target: LisaStorageController
    });

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaStorageService: LisaStorageService
    ) {}

    public bindListeners(): void {
        this.lisaStateController.stateChangeSubject
            .pipe(throttleTime(LisaStorageController.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(lisaState => {
                this.lisaStorageService
                    .storeState(lisaState)
                    .catch(e =>
                        LisaStorageController.logger.error(
                            "Could not save state!",
                            e
                        )
                    );
            });
    }
}

export { LisaStorageController };
