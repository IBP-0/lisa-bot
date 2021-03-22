import type { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { rootLogger } from "../../logger";
import type { LisaState } from "./LisaState";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { LisaStateRepository } from "./LisaStateRepository";

@injectable()
class StateStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;

    private static readonly logger = rootLogger.child({
        target: StateStorageController,
    });

    readonly #lisaStateRepository: LisaStateRepository;

    constructor(
        @inject(TYPES.LisaStateRepository)
        lisaStateRepository: LisaStateRepository
    ) {
        this.#lisaStateRepository = lisaStateRepository;
    }

    public bindStateChangeSubscription(
        stateChangeSubject: Subject<LisaState>
    ): void {
        stateChangeSubject
            .pipe(throttleTime(StateStorageController.STORAGE_THROTTLE_TIMEOUT))
            .subscribe((state) => {
                this.#lisaStateRepository
                    .update(state)
                    .catch((e) =>
                        StateStorageController.logger.error(
                            "Could not save state!",
                            e
                        )
                    );
            });
    }
}

export { StateStorageController };
