import { DefaultBootstrappings, Injectable } from "chevronjs";
import { pathExists } from "fs-extra";
import { clone, cloneDeep } from "lodash";
import { Subject, Subscription } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStorageService } from "./service/LisaStorageService";
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
    dependencies: [LisaStorageService]
})
class LisaStateController {
    public static readonly STORAGE_PATH = "data/lisaState.json";

    private static readonly logger = rootLogger.child({
        service: LisaStateController
    });

    private static readonly STORAGE_THROTTLE_TIMEOUT = 10000;

    public readonly stateChangeSubject: Subject<void>;
    private state: LisaState;

    constructor(private readonly lisaStorageService: LisaStorageService) {
        this.state = createInitialLisaState();
        this.stateChangeSubject = new Subject<void>();
        this.stateChangeSubject
            .pipe(throttleTime(LisaStateController.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(() => {
                this.storeState().catch(e =>
                    LisaStateController.logger.error("Could not save state!", e)
                );
            });
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

    public getStateCopy(): LisaState {
        return cloneDeep(this.state);
    }

    public async storedStateExists(): Promise<boolean> {
        return pathExists(LisaStateController.STORAGE_PATH);
    }

    public async loadStoredState(): Promise<void> {
        this.state = await this.lisaStorageService.loadStoredState(
            LisaStateController.STORAGE_PATH
        );
        LisaStateController.logger.debug("Loaded stored Lisa state.");
        this.stateChangeSubject.next();
    }

    private async storeState(): Promise<void> {
        LisaStateController.logger.debug(
            `Saving Lisa's state to '${LisaStateController.STORAGE_PATH}'...`
        );
        await this.lisaStorageService.storeState(
            LisaStateController.STORAGE_PATH,
            this.state
        );
        LisaStateController.logger.debug(
            `Saved Lisa's state to '${LisaStateController.STORAGE_PATH}'.`
        );
    }
}

export { LisaStateController };
