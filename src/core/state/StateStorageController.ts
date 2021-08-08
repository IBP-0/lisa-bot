import { inject, injectable } from "inversify";
import type { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { rootLogger } from "../../logger";
import { TYPES } from "../../types";
import type { State } from "./State";
import { StateRepository } from "./StateRepository";

@injectable()
class StateStorageController {
    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;

    private static readonly logger = rootLogger.child({
        target: StateStorageController,
    });

    readonly #stateRepository: StateRepository;

    constructor(
        @inject(TYPES.StateRepository)
            stateRepository: StateRepository
    ) {
        this.#stateRepository = stateRepository;
    }

    bindStateChangeSubscription(stateChangeSubject: Subject<State>): void {
        stateChangeSubject
            .pipe(throttleTime(StateStorageController.STORAGE_THROTTLE_TIMEOUT))
            .subscribe((state) => {
                this.#stateRepository
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
