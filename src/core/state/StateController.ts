import { inject, injectable } from "inversify";
import { cloneDeep } from "lodash";
import { Duration } from "luxon";
import { interval, Subject } from "rxjs";
import { rootLogger } from "../../logger";
import { TYPES } from "../../types";
import { StatusService } from "../status/StatusService";
import { TimeProvider } from "../time/TimeProvider";
import type { State } from "./State";
import {
    DeathCause,
    HAPPINESS_INITIAL,
    HAPPINESS_MAX,
    HAPPINESS_MIN,
    WATER_INITIAL,
    WATER_MAX,
    WATER_MIN,
} from "./State";

@injectable()
class StateController {
    private static readonly logger = rootLogger.child({
        target: StateController,
    });

    private static readonly INITIATOR_SYSTEM = "System";
    private static readonly BEST_LIFETIME_CHECK_TIMEOUT = 5000;

    readonly #statusService: StatusService;
    readonly #timeProvider: TimeProvider;
    public readonly stateChangeSubject: Subject<State>;

    #globalState: State;

    constructor(
        @inject(TYPES.StatusService) statusService: StatusService,
        @inject(TYPES.TimeProvider) timeProvider: TimeProvider
    ) {
        this.#statusService = statusService;
        this.#timeProvider = timeProvider;

        this.#globalState = this.createNewLisaState(
            StateController.INITIATOR_SYSTEM,
            Duration.fromMillis(0)
        );

        this.stateChangeSubject = new Subject<State>();

        interval(StateController.BEST_LIFETIME_CHECK_TIMEOUT).subscribe(() =>
            this.#updateBestLifetimeIfRequired(this.#globalState)
        );
    }

    private createNewLisaState(
        birthInitiator: string,
        bestLifetime: Duration
    ): State {
        return {
            bestLifetimeDuration: bestLifetime,
            status: {
                water: WATER_INITIAL,
                happiness: HAPPINESS_INITIAL,
            },
            birth: {
                timestamp: this.#timeProvider.now(),
                initiator: birthInitiator,
            },
            death: {
                timestamp: null,
                initiator: null,
                cause: null,
            },
        };
    }

    /**
     * Gets a copy of the state to process e.g. when creating text for the current status.
     *
     * @return copy of the current state.
     */
    public getStateCopy(): State {
        return cloneDeep(this.#globalState);
    }

    /**
     * Only used for loading persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    public loadState(state: State): void {
        this.#globalState = state;
        this.#stateChanged(state);
    }

    public replantLisa(
        initiator: string = StateController.INITIATOR_SYSTEM
    ): void {
        const state = this.#globalState;
        StateController.logger.info(`'${initiator}' replanted lisa.`);

        this.#performReplant(state, initiator);
        this.#stateChanged(state);
    }

    public killLisa(
        cause: DeathCause,
        initiator: string = StateController.INITIATOR_SYSTEM
    ): void {
        const state = this.#globalState;
        if (!this.#statusService.isAlive(state)) {
            StateController.logger.debug("Lisa is already dead, skip kill.");
            return;
        }

        StateController.logger.info(`'${initiator}' killed lisa by ${cause}.`);
        this.#performKill(state, initiator, cause);

        this.#stateChanged(state);
    }

    public modifyLisaStatus(
        waterModifier: number,
        happinessModifier: number,
        initiator: string = StateController.INITIATOR_SYSTEM
    ): void {
        const state = this.#globalState;
        if (!this.#statusService.isAlive(state)) {
            StateController.logger.debug("Lisa is dead, skip status change.");
            return;
        }

        StateController.logger.debug(
            `'${initiator}' modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`
        );
        this.#performModifyStatus(
            state,
            initiator,
            waterModifier,
            happinessModifier
        );

        this.#stateChanged(state);
    }

    #performReplant(state: State, initiator: string): void {
        Object.assign(
            state,
            this.createNewLisaState(initiator, state.bestLifetimeDuration)
        );
    }

    #performKill(state: State, initiator: string, cause: DeathCause): void {
        state.death = {
            timestamp: this.#timeProvider.now(),
            initiator: initiator,
            cause,
        };
    }

    #performModifyStatus(
        state: State,
        initiator: string,
        waterModifier: number,
        happinessModifier: number
    ): void {
        state.status.water += waterModifier;
        state.status.happiness += happinessModifier;

        this.#checkStats(state, initiator);
    }

    #checkStats(state: State, initiator: string): void {
        if (state.status.water > WATER_MAX) {
            StateController.logger.silly(
                `Water level ${state.status.water} is above limit of ${WATER_MAX} -> ${DeathCause.DROWNING}.`
            );

            this.#performKill(state, initiator, DeathCause.DROWNING);
        } else if (state.status.water < WATER_MIN) {
            StateController.logger.silly(
                `Water level ${state.status.water} is below limit of ${WATER_MIN} -> ${DeathCause.DEHYDRATION}.`
            );

            this.#performKill(state, initiator, DeathCause.DEHYDRATION);
        }

        if (state.status.happiness > HAPPINESS_MAX) {
            StateController.logger.silly(
                `Happiness level ${state.status.happiness} is above limit of ${HAPPINESS_MAX} -> reducing to limit.`
            );

            state.status.happiness = HAPPINESS_MAX;
        } else if (state.status.happiness < HAPPINESS_MIN) {
            StateController.logger.silly(
                `Happiness level ${state.status.happiness} is below limit of ${HAPPINESS_MIN} -> ${DeathCause.SADNESS}.`
            );

            this.#performKill(state, initiator, DeathCause.SADNESS);
        }
    }

    #stateChanged(state: State): void {
        StateController.logger.silly("Lisa state changed.");

        this.stateChangeSubject.next(cloneDeep(state));
    }

    #updateBestLifetimeIfRequired(state: State): void {
        const lifetime = this.#statusService.getLifetime(state);
        if (lifetime > state.bestLifetimeDuration) {
            StateController.logger.silly(
                `Increasing high score from ${state.bestLifetimeDuration.toMillis()} to ${lifetime.toMillis()}.`
            );
            state.bestLifetimeDuration = lifetime;
        }
    }
}

export { StateController };
