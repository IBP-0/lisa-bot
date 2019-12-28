import { Injectable } from "chevronjs";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../../chevron";
import { rootLogger } from "../../logger";
import { LisaState } from "../LisaState";
import { JsonStorageService } from "../service/JsonStorageService";
import { LisaStateStorageService } from "../service/LisaStateStorageService";
import { LisaStateController } from "./LisaStateController";

@Injectable(chevron, {
    dependencies: [
        LisaStateController,
        JsonStorageService,
        LisaStateStorageService
    ]
})
class LisaStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;

    private static readonly STORAGE_PATH = "data/storage.json";
    private static readonly STORAGE_KEY = "lisaState";

    private static readonly logger = rootLogger.child({
        target: LisaStorageController
    });

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly jsonStorageService: JsonStorageService,
        private readonly lisaStateStorageService: LisaStateStorageService
    ) {}

    public bindListeners(): void {
        this.lisaStateController.stateChangeSubject
            .pipe(throttleTime(LisaStorageController.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(() => {
                this.storeState(
                    this.lisaStateController.getStateCopy()
                ).catch(e =>
                    LisaStorageController.logger.error(
                        "Could not save state!",
                        e
                    )
                );
            });
    }

    public async hasStoredState(): Promise<boolean> {
        return this.jsonStorageService.hasStorageKey(
            LisaStorageController.STORAGE_PATH,
            LisaStorageController.STORAGE_KEY
        );
    }

    public async loadStoredState(): Promise<LisaState> {
        const storedState = await this.jsonStorageService.load(
            LisaStorageController.STORAGE_PATH,
            LisaStorageController.STORAGE_KEY
        );
        return this.lisaStateStorageService.fromStorable(storedState);
    }

    public async storeState(state: LisaState): Promise<void> {
        const jsonLisaState = this.lisaStateStorageService.toStorable(state);
        return await this.jsonStorageService.store(
            LisaStorageController.STORAGE_PATH,
            LisaStorageController.STORAGE_KEY,
            jsonLisaState
        );
    }
}

export { LisaStorageController };
