import { cloneDeep } from "lodash";
import type { Duration } from "moment";
import { duration } from "moment";
import { interval, Subject } from "rxjs";
import { rootLogger } from "../../logger";
import type { LisaState } from "./LisaState";
import {
    HAPPINESS_INITIAL,
    HAPPINESS_MAX,
    HAPPINESS_MIN,
    LisaDeathCause,
    WATER_INITIAL,
    WATER_MAX,
    WATER_MIN,
} from "./LisaState";
import type { StatusService } from "../status/StatusService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

@injectable()
class StateController {
    private static readonly logger = rootLogger.child({
        target: StateController,
    });

    private static readonly INITIATOR_SYSTEM = "System";
    private static readonly BEST_LIFETIME_CHECK_TIMEOUT = 5000;
    public readonly stateChangeSubject: Subject<LisaState>;
    private readonly lisaStatusService: StatusService;
    private state: LisaState;

    constructor(
        @inject(TYPES.LisaStatusService) lisaStatusService: StatusService
    ) {
        this.lisaStatusService = lisaStatusService;
        this.state = StateController.createNewLisaState(
            StateController.INITIATOR_SYSTEM,
            duration(0)
        );
        this.stateChangeSubject = new Subject<LisaState>();

        interval(StateController.BEST_LIFETIME_CHECK_TIMEOUT).subscribe(() =>
            this.updateBestLifetimeIfRequired()
        );
    }

    private static createNewLisaState(
        birthInitiator: string,
        bestLifetime: Duration
    ): LisaState {
        return {
            bestLifetimeDuration: bestLifetime,
            status: {
                water: WATER_INITIAL,
                happiness: HAPPINESS_INITIAL,
            },
            birth: {
                timestamp: new Date(),
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
    public getStateCopy(): LisaState {
        return cloneDeep(this.state);
    }

    /**
     * Only used for loading persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    public loadState(state: LisaState): void {
        this.state = state;
        this.stateChanged();
    }

    public replantLisa(initiator: string = StateController.INITIATOR_SYSTEM): void {
        StateController.logger.info(`'${initiator}' replanted lisa.`);

        this.performReplant(initiator);
        this.stateChanged();
    }

    public killLisa(
        cause: LisaDeathCause,
        initiator: string = StateController.INITIATOR_SYSTEM
    ): void {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            StateController.logger.debug("Lisa is already dead, skip kill.");
            return;
        }

        StateController.logger.info(`'${initiator}' killed lisa by ${cause}.`);
        this.performKill(cause, initiator);

        this.stateChanged();
    }

    public modifyLisaStatus(
        waterModifier: number,
        happinessModifier: number,
        initiator: string = StateController.INITIATOR_SYSTEM
    ): void {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            StateController.logger.debug("Lisa is dead, skip status change.");
            return;
        }

        StateController.logger.debug(
            `'${initiator}' modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`
        );
        this.performModifyStatus(waterModifier, happinessModifier, initiator);

        this.stateChanged();
    }

    private performReplant(initiator: string): void {
        this.state = StateController.createNewLisaState(
            initiator,
            this.state.bestLifetimeDuration
        );
    }

    private performKill(cause: LisaDeathCause, initiator: string): void {
        this.state.death = { timestamp: new Date(), initiator: initiator, cause };
    }

    private performModifyStatus(
        waterModifier: number,
        happinessModifier: number,
        initiator: string
    ): void {
        this.state.status.water += waterModifier;
        this.state.status.happiness += happinessModifier;

        this.checkStats(initiator);
    }

    private checkStats(initiator: string): void {
        if (this.state.status.water > WATER_MAX) {
            StateController.logger.silly(
                `Water level ${this.state.status.water} is above limit of ${WATER_MAX} -> ${LisaDeathCause.DROWNING}.`
            );

            this.performKill(LisaDeathCause.DROWNING, initiator);
        } else if (this.state.status.water < WATER_MIN) {
            StateController.logger.silly(
                `Water level ${this.state.status.water} is below limit of ${WATER_MIN} -> ${LisaDeathCause.DEHYDRATION}.`
            );

            this.performKill(LisaDeathCause.DEHYDRATION, initiator);
        }

        if (this.state.status.happiness > HAPPINESS_MAX) {
            StateController.logger.silly(
                `Happiness level ${this.state.status.happiness} is above limit of ${HAPPINESS_MAX} -> reducing to limit.`
            );

            this.state.status.happiness = HAPPINESS_MAX;
        } else if (this.state.status.happiness < HAPPINESS_MIN) {
            StateController.logger.silly(
                `Happiness level ${this.state.status.happiness} is below limit of ${HAPPINESS_MIN} -> ${LisaDeathCause.SADNESS}.`
            );

            this.performKill(LisaDeathCause.SADNESS, initiator);
        }
    }

    private stateChanged(): void {
        StateController.logger.silly("Lisa state changed.");

        this.stateChangeSubject.next(this.getStateCopy());
    }

    private updateBestLifetimeIfRequired(): void {
        const lifetime = this.lisaStatusService.getLifetime(
            this.getStateCopy()
        );
        if (lifetime > this.state.bestLifetimeDuration) {
            StateController.logger.silly(
                `Increasing high score from ${this.state.bestLifetimeDuration.asMilliseconds()} to ${lifetime.asMilliseconds()}.`
            );
            this.state.bestLifetimeDuration = lifetime;
        }
    }
}

export { StateController };
