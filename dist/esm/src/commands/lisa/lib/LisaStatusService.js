import { InjectableType } from "chevronjs";
import { isNil, objFromDeep } from "lightdash";
import { lisaChevron } from "../../../di";
import { Death } from "./Death";
const MIN_WATER = 0.1;
const MAX_WATER = 150;
const MIN_HAPPINESS = 0.1;
const MAX_HAPPINESS = 100;
const FACTOR = (MAX_WATER + MAX_HAPPINESS) / 2;
class LisaStatusService {
    modify(lisaData, username, modifierWater, modifierHappiness) {
        if (!lisaData.life.isAlive) {
            return lisaData;
        }
        const result = objFromDeep(lisaData);
        result.status.water += modifierWater;
        if (result.status.water > MAX_WATER) {
            return this.setDeath(result, username, Death.DROWNING);
        }
        if (result.status.water < MIN_WATER) {
            return this.setDeath(result, username, Death.DEHYDRATION);
        }
        result.status.happiness += modifierHappiness;
        if (result.status.happiness > MAX_HAPPINESS) {
            result.status.happiness = MAX_HAPPINESS;
        }
        if (result.status.happiness < MIN_HAPPINESS) {
            return this.setDeath(result, username, Death.SADNESS);
        }
        this.updateHighScoreIfRequired(lisaData);
        return result;
    }
    kill(lisaData, username, deathThrough) {
        if (!lisaData.life.isAlive) {
            return lisaData;
        }
        const result = objFromDeep(lisaData);
        return this.setDeath(result, username, deathThrough);
    }
    // noinspection JSMethodCanBeStatic
    createNewLisa(oldLisaData) {
        return {
            status: {
                water: 100,
                happiness: 100
            },
            life: {
                isAlive: true,
                killer: "Anonymous",
                deathThrough: Death.UNKNOWN,
                birth: Date.now(),
                death: 0
            },
            score: {
                highScore: isNil(oldLisaData) ? 0 : oldLisaData.score.highScore
            }
        };
    }
    // noinspection JSMethodCanBeStatic
    getLifetime(lisaData) {
        if (!lisaData.life.isAlive) {
            return lisaData.life.death - lisaData.life.birth;
        }
        return Date.now() - lisaData.life.birth;
    }
    // noinspection JSMethodCanBeStatic
    getTimeSinceDeath(lisaData) {
        return Date.now() - lisaData.life.death;
    }
    getHighScore(lisaData) {
        this.updateHighScoreIfRequired(lisaData);
        return lisaData.score.highScore;
    }
    // noinspection JSMethodCanBeStatic
    getRelativeState(lisaData) {
        const relWater = lisaData.status.water / MAX_WATER;
        const relHappiness = lisaData.status.happiness / MAX_HAPPINESS;
        return relWater * relHappiness * FACTOR;
    }
    setDeath(lisaData, username, deathThrough) {
        lisaData.life.isAlive = false;
        lisaData.life.death = Date.now();
        lisaData.life.deathThrough = deathThrough;
        lisaData.life.killer = username;
        this.updateHighScoreIfRequired(lisaData);
        return lisaData;
    }
    updateHighScoreIfRequired(lisaData) {
        const currentScore = this.getLifetime(lisaData);
        if (currentScore > lisaData.score.highScore) {
            lisaData.score.highScore = currentScore;
        }
    }
}
lisaChevron.set(InjectableType.FACTORY, [], LisaStatusService);
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.js.map