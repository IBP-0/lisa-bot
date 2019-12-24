import { DefaultBootstrappings, Injectable } from "chevronjs";
import { clone, cloneDeep } from "lodash";
import { Subject } from "rxjs";
import { chevron } from "../chevron";
import { LisaDeath, LisaDeathCause, LisaLife, LisaState } from "./LisaState";

const WATER_INITIAL = 100;
const WATER_MIN = 0.1;
const WATER_MAX = 150;

const HAPPINESS_INITIAL = 100;
const HAPPINESS_MIN = 0.1;
const HAPPINESS_MAX = 100;

const USER_SYSTEM = "System";

const createInitialLisaState = (): LisaState => {
    return {
        status: {
            water: WATER_INITIAL,
            happiness: HAPPINESS_INITIAL
        },
        life: {
            time: new Date(),
            byUser: USER_SYSTEM
        },
        death: {
            time: null,
            byUser: null,
            cause: null
        },
        highScore: 0
    };
};

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: []
})
class LisaStateController {
    public readonly stateChangeSubject: Subject<void>;
    private state: LisaState;

    constructor() {
        this.state = createInitialLisaState();
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
     * Only used for loading od persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    public load(state: LisaState): void {
        this.state = state;
        this.stateChanged(USER_SYSTEM);
    }

    public isAlive(): boolean {
        return this.state.death.time == null;
    }

    public getWater(): number {
        return this.state.status.water;
    }

    public setWater(water: number, byUser: string = USER_SYSTEM): void {
        this.state.status.water = water;
        this.stateChanged(byUser);
    }

    public getHappiness(): number {
        return this.state.status.happiness;
    }

    public setHappiness(happiness: number, byUser: string = USER_SYSTEM): void {
        this.state.status.happiness = happiness;
        this.stateChanged(byUser);
    }

    public getHighScore(): number {
        return this.state.highScore;
    }

    public getLife(): LisaLife {
        return clone(this.state.life);
    }

    public setLife(byUser: string = USER_SYSTEM): void {
        this.state.life = { time: new Date(), byUser };
        this.stateChanged(byUser);
    }

    public getDeath(): LisaDeath {
        return clone(this.state.death);
    }

    public setDeath(cause: LisaDeathCause, byUser: string = USER_SYSTEM): void {
        this.state.death = { time: new Date(), byUser, cause };
        this.stateChanged(byUser);
    }

    private stateChanged(byUser: string): void {
        if (this.isAlive()) {
            // Adjust stats if alive
            this.updateStats(byUser);
            // Check again to see if Lisa was killed through the update.
            if (!this.isAlive()) {
                this.updateHighScoreIfRequired();
            }
        }

        this.stateChangeSubject.next();
    }

    private updateStats(byUser: string): void {
        if (this.state.status.water > WATER_MAX) {
            this.setDeath(LisaDeathCause.DROWNING, byUser);
        } else if (this.state.status.water < WATER_MIN) {
            this.setDeath(LisaDeathCause.DEHYDRATION, byUser);
        }

        if (this.state.status.happiness > HAPPINESS_MAX) {
            this.state.status.happiness = HAPPINESS_MAX;
        } else if (this.state.status.happiness < HAPPINESS_MIN) {
            this.setDeath(LisaDeathCause.SADNESS, byUser);
        }
    }

    private updateHighScoreIfRequired(): void {
        const lifetime = this.getLifetime();
        if (lifetime > this.state.highScore) {
            this.state.highScore = lifetime;
        }
    }

    private getLifetime(): number {
        const birth = this.state.life.time.getTime();

        if (!this.isAlive()) {
            const death = this.state.death.time!.getTime();
            return death - birth;
        }

        const now = Date.now();
        return now - birth;
    }
}

export { LisaStateController };
