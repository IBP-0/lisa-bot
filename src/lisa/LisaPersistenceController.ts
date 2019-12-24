import { DefaultBootstrappings, Injectable } from "chevronjs";
import { pathExists } from "fs-extra";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
import { LisaStorageService } from "./service/LisaStorageService";

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStateController, LisaStorageService]
})
class LisaPersistenceController {
    public static readonly STORAGE_PATH = "data/lisaState.json";

    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;

    private static readonly logger = rootLogger.child({
        target: LisaStateController
    });

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaStorageService: LisaStorageService
    ) {
        this.lisaStateController.stateChangeSubject
            .pipe(
                throttleTime(LisaPersistenceController.STORAGE_THROTTLE_TIMEOUT)
            )
            .subscribe(() => {
                this.storeState().catch(e =>
                    LisaPersistenceController.logger.error(
                        "Could not save state!",
                        e
                    )
                );
            });
    }

    public async storedStateExists(): Promise<boolean> {
        return pathExists(LisaPersistenceController.STORAGE_PATH);
    }

    public async loadStoredState(): Promise<void> {
        const state = await this.lisaStorageService.loadStoredState(
            LisaPersistenceController.STORAGE_PATH
        );
        this.lisaStateController.load(state);
    }

    private async storeState(): Promise<void> {
        LisaPersistenceController.logger.debug(
            `Saving Lisa's state to '${LisaPersistenceController.STORAGE_PATH}'...`
        );
        await this.lisaStorageService.storeState(
            LisaPersistenceController.STORAGE_PATH,
            this.lisaStateController.getStateCopy()
        );
        LisaPersistenceController.logger.debug(
            `Saved Lisa's state to '${LisaPersistenceController.STORAGE_PATH}'.`
        );
    }
}

export { LisaPersistenceController };
