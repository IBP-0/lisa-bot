import { Injectable } from "chevronjs";
import { cloneDeep } from "lodash";
import { Duration, duration } from "moment";
import { interval, Subject } from "rxjs";
import { chevron } from "../../chevron";
import { rootLogger } from "../../logger";
import {
    HAPPINESS_INITIAL,
    HAPPINESS_MAX,
    HAPPINESS_MIN,
    LisaDeathCause,
    LisaState,
    WATER_INITIAL,
    WATER_MAX,
    WATER_MIN
} from "../LisaState";
import { LisaStatusService } from "../service/LisaStatusService";

@Injectable(chevron, {
    dependencies: [LisaStatusService]
})
class LisaStateController {
    private static readonly logger = rootLogger.child({
        target: LisaStateController
    });

    private static readonly USER_SYSTEM = "System";
    private static readonly BEST_LIFETIME_CHECK_TIMEOUT = 5000;

    public readonly stateChangeSubject: Subject<LisaState>;
    private state: LisaState;

    constructor(private readonly lisaStatusService: LisaStatusService) {
        this.state = LisaStateController.createNewLisaState(
            LisaStateController.USER_SYSTEM,
            duration(0)
        );
        this.stateChangeSubject = new Subject<LisaState>();

        interval(
            LisaStateController.BEST_LIFETIME_CHECK_TIMEOUT
        ).subscribe(() => this.updateBestLifetimeIfRequired());
    }

    private static createNewLisaState(
        createdByUser: string,
        bestLifetime: Duration
    ): LisaState {
        return {
            bestLifetime,
            status: {
                water: WATER_INITIAL,
                happiness: HAPPINESS_INITIAL
            },
            life: {
                time: new Date(),
                byUser: createdByUser
            },
            death: {
                time: null,
                byUser: null,
                cause: null
            }
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

    public replantLisa(byUser: string = LisaStateController.USER_SYSTEM): void {
        LisaStateController.logger.info(`'${byUser}' replanted lisa.`);

        this.performReplant(byUser);
        this.stateChanged();
    }

    public killLisa(
        cause: LisaDeathCause,
        byUser: string = LisaStateController.USER_SYSTEM
    ): void {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            LisaStateController.logger.debug(
                "Lisa is already dead, skip kill."
            );
            return;
        }

        LisaStateController.logger.info(`'${byUser}' killed lisa by ${cause}.`);
        this.performKill(cause, byUser);

        this.stateChanged();
    }

    public modifyLisaStatus(
        waterModifier: number,
        happinessModifier: number,
        byUser: string = LisaStateController.USER_SYSTEM
    ): void {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            LisaStateController.logger.debug(
                "Lisa is dead, skip status change."
            );
            return;
        }

        LisaStateController.logger.info(
            `'${byUser}' modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`
        );
        this.performModifyStatus(waterModifier, happinessModifier, byUser);

        this.stateChanged();
    }

    private performReplant(byUser: string): void {
        this.state = LisaStateController.createNewLisaState(
            byUser,
            this.state.bestLifetime
        );
    }

    private performKill(cause: LisaDeathCause, byUser: string): void {
        this.state.death = { time: new Date(), byUser, cause };
    }

    private performModifyStatus(
        waterModifier: number,
        happinessModifier: number,
        byUser: string
    ): void {
        this.state.status.water += waterModifier;
        this.state.status.happiness += happinessModifier;

        this.checkStats(byUser);
    }

    private checkStats(byUser: string): void {
        if (this.state.status.water > WATER_MAX) {
            LisaStateController.logger.silly(
                `Water level ${this.state.status.water} is above limit of ${WATER_MAX} -> ${LisaDeathCause.DROWNING}.`
            );

            this.performKill(LisaDeathCause.DROWNING, byUser);
        } else if (this.state.status.water < WATER_MIN) {
            LisaStateController.logger.silly(
                `Water level ${this.state.status.water} is below limit of ${WATER_MIN} -> ${LisaDeathCause.DEHYDRATION}.`
            );

            this.performKill(LisaDeathCause.DEHYDRATION, byUser);
        }

        if (this.state.status.happiness > HAPPINESS_MAX) {
            LisaStateController.logger.silly(
                `Happiness level ${this.state.status.happiness} is above limit of ${HAPPINESS_MAX} -> reducing to limit.`
            );

            this.state.status.happiness = HAPPINESS_MAX;
        } else if (this.state.status.happiness < HAPPINESS_MIN) {
            LisaStateController.logger.silly(
                `Happiness level ${this.state.status.happiness} is below limit of ${HAPPINESS_MIN} -> ${LisaDeathCause.SADNESS}.`
            );

            this.performKill(LisaDeathCause.SADNESS, byUser);
        }
    }

    private stateChanged(): void {
        LisaStateController.logger.silly("Lisa state changed.");

        this.stateChangeSubject.next(this.getStateCopy());
    }

    private updateBestLifetimeIfRequired(): void {
        const lifetime = this.lisaStatusService.getLifetime(
            this.getStateCopy()
        );
        if (lifetime > this.state.bestLifetime) {
            LisaStateController.logger.silly(
                `Increasing high score from ${this.state.bestLifetime} to ${lifetime}.`
            );
            this.state.bestLifetime = lifetime;
        }
    }
}

export { LisaStateController };
