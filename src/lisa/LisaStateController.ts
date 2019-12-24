import { DefaultBootstrappings, Injectable } from "chevronjs";
import { clone, cloneDeep } from "lodash";
import { Subject } from "rxjs";
import { chevron } from "../chevron";
import { LisaDeath, LisaDeathCause, LisaLife, LisaState } from "./LisaState";

const createInitialLisaState = (): LisaState => {
    return {
        status: {
            water: 100,
            happiness: 100
        },
        life: {
            time: new Date(),
            byUser: "System"
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
        this.stateChangeSubject.next();
    }

    public isAlive(): boolean {
        return this.state.death.time == null;
    }

    public getWater(): number {
        return this.state.status.water;
    }

    public setWater(water: number): void {
        this.state.status.water = water;
        this.stateChangeSubject.next();
    }

    public getHappiness(): number {
        return this.state.status.happiness;
    }

    public setHappiness(happiness: number): void {
        this.state.status.happiness = happiness;
        this.stateChangeSubject.next();
    }

    public getHighScore(): number {
        return this.state.highScore;
    }

    public setHighScore(highScore: number): void {
        this.state.highScore = highScore;
        this.stateChangeSubject.next();
    }

    public getLife(): LisaLife {
        return clone(this.state.life);
    }

    public setLife(time: Date, byUser: string): void {
        this.state.life = { time, byUser };
        this.stateChangeSubject.next();
    }

    public getDeath(): LisaDeath {
        return clone(this.state.death);
    }

    public setDeath(time: Date, byUser: string, cause: LisaDeathCause): void {
        this.state.death = { time, byUser, cause };
        this.stateChangeSubject.next();
    }
}

export { LisaStateController };
