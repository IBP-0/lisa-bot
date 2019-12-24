import { Subject } from "rxjs";
import { LisaDeath, LisaDeathCause, LisaLife, LisaState } from "./LisaState";
declare class LisaStateController {
    readonly stateChangeSubject: Subject<void>;
    private state;
    constructor();
    /**
     * Gets a copy of the state to process e.g. when creating text for the current status.
     *
     * @return copy of the current state.
     */
    getStateCopy(): LisaState;
    /**
     * Only used for loading od persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    load(state: LisaState): void;
    isAlive(): boolean;
    getWater(): number;
    setWater(water: number): void;
    getHappiness(): number;
    setHappiness(happiness: number): void;
    getHighScore(): number;
    setHighScore(highScore: number): void;
    getLife(): LisaLife;
    setLife(time: Date, byUser: string): void;
    getDeath(): LisaDeath;
    setDeath(time: Date, byUser: string, cause: LisaDeathCause): void;
}
export { LisaStateController };
//# sourceMappingURL=LisaStateController.d.ts.map