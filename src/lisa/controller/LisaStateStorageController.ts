import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { rootLogger } from "../../logger";
import { LisaState } from "../LisaState";
import { JsonStorageService } from "../service/JsonStorageService";
import { LisaStateStorageService } from "../service/LisaStateStorageService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

@injectable()
class LisaStateStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;
    private static readonly STORAGE_PATH = "data/storage.json";
    private static readonly STORAGE_KEY = "lisaState";

    private static readonly logger = rootLogger.child({
        target: LisaStateStorageController,
    });

    private readonly jsonStorageService: JsonStorageService;
    private readonly lisaStateStorageService: LisaStateStorageService;

    constructor(
        @inject(TYPES.JsonStorageService)
        jsonStorageService: JsonStorageService,
        @inject(TYPES.LisaStateStorageService)
        lisaStateStorageService: LisaStateStorageService
    ) {
        this.lisaStateStorageService = lisaStateStorageService;
        this.jsonStorageService = jsonStorageService;
    }

    public bindStateChangeSubscription(
        stateChangeSubject: Subject<LisaState>
    ): void {
        stateChangeSubject
            .pipe(
                throttleTime(
                    LisaStateStorageController.STORAGE_THROTTLE_TIMEOUT
                )
            )
            .subscribe((state) => {
                this.storeState(state).catch((e) =>
                    LisaStateStorageController.logger.error(
                        "Could not save state!",
                        e
                    )
                );
            });
    }

    public async hasStoredState(): Promise<boolean> {
        return this.jsonStorageService.hasStorageKey(
            LisaStateStorageController.STORAGE_PATH,
            LisaStateStorageController.STORAGE_KEY
        );
    }

    public async loadStoredState(): Promise<LisaState> {
        const storedState = await this.jsonStorageService.load(
            LisaStateStorageController.STORAGE_PATH,
            LisaStateStorageController.STORAGE_KEY
        );
        return this.lisaStateStorageService.fromStorable(storedState);
    }

    public async storeState(state: LisaState): Promise<void> {
        const jsonLisaState = this.lisaStateStorageService.toStorable(state);
        return await this.jsonStorageService.store(
            LisaStateStorageController.STORAGE_PATH,
            LisaStateStorageController.STORAGE_KEY,
            jsonLisaState
        );
    }
}

export { LisaStateStorageController };
