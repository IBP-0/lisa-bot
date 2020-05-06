import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { rootLogger } from "../../logger";
import { LisaState } from "../LisaState";
import { JsonStorageService } from "../service/JsonStorageService";
import { StateStorageService } from "../service/StateStorageService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

@injectable()
class StateStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;
    private static readonly STORAGE_PATH = "data/storage.json";
    private static readonly STORAGE_KEY = "lisaState";

    private static readonly logger = rootLogger.child({
        target: StateStorageController,
    });

    private readonly jsonStorageService: JsonStorageService;
    private readonly lisaStateStorageService: StateStorageService;

    constructor(
        @inject(TYPES.JsonStorageService)
        jsonStorageService: JsonStorageService,
        @inject(TYPES.LisaStateStorageService)
        lisaStateStorageService: StateStorageService
    ) {
        this.lisaStateStorageService = lisaStateStorageService;
        this.jsonStorageService = jsonStorageService;
    }

    public bindStateChangeSubscription(
        stateChangeSubject: Subject<LisaState>
    ): void {
        stateChangeSubject
            .pipe(throttleTime(StateStorageController.STORAGE_THROTTLE_TIMEOUT))
            .subscribe((state) => {
                this.storeState(state).catch((e) =>
                    StateStorageController.logger.error(
                        "Could not save state!",
                        e
                    )
                );
            });
    }

    public async hasStoredState(): Promise<boolean> {
        return this.jsonStorageService.hasStorageKey(
            StateStorageController.STORAGE_PATH,
            StateStorageController.STORAGE_KEY
        );
    }

    public async loadStoredState(): Promise<LisaState> {
        const storedState = await this.jsonStorageService.load(
            StateStorageController.STORAGE_PATH,
            StateStorageController.STORAGE_KEY
        );
        return this.lisaStateStorageService.fromStorable(storedState);
    }

    public async storeState(state: LisaState): Promise<void> {
        const jsonLisaState = this.lisaStateStorageService.toStorable(state);
        return await this.jsonStorageService.store(
            StateStorageController.STORAGE_PATH,
            StateStorageController.STORAGE_KEY,
            jsonLisaState
        );
    }
}

export { StateStorageController };
