import { InjectableType } from "chevronjs";
import { objFromDeep } from "lightdash";
import { lisaChevron } from "../../../di";
import { Deaths } from "./Deaths";
import { ILisaData } from "./ILisaData";

const MIN_WATER = 0.1;
const MAX_WATER = 150;

const MIN_HAPPINESS = 0.1;
const MAX_HAPPINESS = 100;

const FACTOR = (MAX_WATER + MAX_HAPPINESS) / 2;

class LisaStatusService {
    public modify(
        lisaData: ILisaData,
        username: string,
        modifierWater: number,
        modifierHappiness: number
    ): ILisaData {
        if (!lisaData.life.isAlive) {
            return lisaData;
        }

        const result = <ILisaData>objFromDeep(lisaData);

        result.status.water += modifierWater;
        if (result.status.water > MAX_WATER) {
            return this.kill(result, username, Deaths.DROWNING);
        }
        if (result.status.water < MIN_WATER) {
            return this.kill(result, username, Deaths.DEHYDRATION);
        }

        result.status.happiness += modifierHappiness;
        if (result.status.happiness > MAX_HAPPINESS) {
            result.status.happiness = MAX_HAPPINESS;
        }
        if (result.status.happiness < MIN_HAPPINESS) {
            return this.kill(result, username, Deaths.LONELINESS);
        }

        this.updateHighScoreIfRequired(lisaData);
        return result;
    }

    public getLifetime(lisaData: ILisaData): number {
        if (!lisaData.life.isAlive) {
            return lisaData.life.death - lisaData.life.birth;
        }

        return Date.now() - lisaData.life.birth;
    }

    public getTimeSinceDeath(lisaData: ILisaData): number {
        return Date.now() - lisaData.life.death;
    }

    public getHighScore(lisaData: ILisaData): number {
        this.updateHighScoreIfRequired(lisaData);

        return lisaData.score.highScore;
    }

    public getRelativeState(lisaData: ILisaData): number {
        const relWater = lisaData.status.water / MAX_WATER;
        const relHappiness = lisaData.status.happiness / MAX_HAPPINESS;

        return relWater * relHappiness * FACTOR;
    }

    private kill(
        lisaData: ILisaData,
        username: string,
        deathThrough: Deaths
    ): ILisaData {
        lisaData.life.isAlive = false;
        lisaData.life.death = Date.now();
        lisaData.life.deathThrough = deathThrough;
        lisaData.life.killer = username;
        this.updateHighScoreIfRequired(lisaData);

        return lisaData;
    }

    private updateHighScoreIfRequired(lisaData: ILisaData) {
        const score = this.getLifetime(lisaData);
        if (score > lisaData.score.highScore) {
            lisaData.score.highScore = score;
        }
    }
}

lisaChevron.set(InjectableType.FACTORY, [], LisaStatusService);

export { LisaStatusService };
