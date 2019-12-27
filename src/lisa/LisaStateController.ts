import { DefaultBootstrappings, Injectable } from "chevronjs";
import { cloneDeep } from "lodash";
import { duration } from "moment";
import { Subject } from "rxjs";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import {
    HAPPINESS_INITIAL,
    HAPPINESS_MAX,
    HAPPINESS_MIN,
    LisaDeathCause,
    LisaState,
    USER_SYSTEM,
    WATER_INITIAL,
    WATER_MAX,
    WATER_MIN
} from "./LisaState";
import { LisaStatusService } from "./service/LisaStatusService";

const createNewLisaState = (
    createdByUser: string,
    bestLifetime = duration(0)
): LisaState => {
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
};

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStatusService]
})
class LisaStateController {
    private static readonly logger = rootLogger.child({
        target: LisaStateController
    });

    public readonly stateChangeSubject: Subject<void>;
    private state: LisaState;

    constructor(private readonly lisaStatusService: LisaStatusService) {
        this.state = createNewLisaState(USER_SYSTEM);
        this.stateChangeSubject = new Subject<void>();
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
    public load(state: LisaState): void {
        this.state = state;
        this.stateChanged();
    }

    public replantLisa(byUser: string = USER_SYSTEM): void {
        LisaStateController.logger.debug(`'${byUser}' replanted lisa.`);

        this.performReplant(byUser);
        this.stateChanged();
    }

    public killLisa(cause: LisaDeathCause, byUser: string = USER_SYSTEM): void {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            LisaStateController.logger.silly(
                "Lisa is already dead, skip kill."
            );
            return;
        }

        LisaStateController.logger.debug(
            `'${byUser}' killed lisa by ${cause}.`
        );
        this.performKill(byUser, cause);

        this.stateChanged();
    }

    public modifyLisaStatus(
        waterModifier: number,
        happinessModifier: number,
        byUser: string = USER_SYSTEM
    ): void {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            LisaStateController.logger.silly(
                "Lisa is dead, skip status change."
            );
            return;
        }

        LisaStateController.logger.silly(
            `'${byUser}' modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`
        );
        this.performModifyStatus(waterModifier, happinessModifier, byUser);

        this.stateChanged();
    }

    private performReplant(byUser: string): void {
        this.state = createNewLisaState(byUser, this.state.bestLifetime);
    }

    private performKill(byUser: string, cause: LisaDeathCause): void {
        this.state.death = { time: new Date(), byUser, cause };
        this.updateBestLifetimeIfRequired();
    }

    private performModifyStatus(
        waterModifier: number,
        happinessModifier: number,
        byUser: string
    ): void {
        this.state.status.water += waterModifier;
        this.state.status.happiness += happinessModifier;

        this.updateBestLifetimeIfRequired();
        this.checkStats(byUser);
    }

    private checkStats(byUser: string): void {
        if (this.state.status.water > WATER_MAX) {
            LisaStateController.logger.silly(
                `Water level ${this.state.status.water} is above limit of ${WATER_MAX} -> ${LisaDeathCause.DROWNING}.`
            );

            this.killLisa(LisaDeathCause.DROWNING, byUser);
        } else if (this.state.status.water < WATER_MIN) {
            LisaStateController.logger.silly(
                `Water level ${this.state.status.water} is below limit of ${WATER_MIN} -> ${LisaDeathCause.DEHYDRATION}.`
            );

            this.killLisa(LisaDeathCause.DEHYDRATION, byUser);
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

            this.killLisa(LisaDeathCause.SADNESS, byUser);
        }
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

    private stateChanged(): void {
        LisaStateController.logger.silly("Lisa state changed.");

        this.stateChangeSubject.next();
    }
}

export { LisaStateController };
