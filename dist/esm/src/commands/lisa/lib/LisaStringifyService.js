import { InjectableType } from "chevronjs";
import * as moment from "moment";
import { lisaChevron } from "../../../di";
import { LisaStatusService } from "./LisaStatusService";
const RELATIVE_STATE_GOOD = 90;
const RELATIVE_STATE_OK = 40;
class LisaStringifyService {
    constructor(lisaStatusService) {
        this.lisaStatusService = lisaStatusService;
    }
    stringifyStatus(lisaData) {
        const statusShort = `Lisa is ${this.stringifyStatusShort(lisaData)}`;
        const score = this.stringifyScore(lisaData);
        let text = [];
        if (!lisaData.life.isAlive) {
            const humanizedTimeSinceDeath = this.humanizeDuration(this.lisaStatusService.getTimeSinceDeath(lisaData));
            const humanizedLifetime = this.humanizeDuration(this.lisaStatusService.getLifetime(lisaData));
            text = [
                `Lisa died ${humanizedTimeSinceDeath} ago, and was alive for ${humanizedLifetime}.`,
                `She was killed by ${lisaData.life.killer} through ${lisaData.life.deathThrough}.`
            ];
        }
        else {
            const waterLevel = Math.floor(lisaData.status.water);
            const happinessLevel = Math.floor(lisaData.status.happiness);
            text = [`Water: ${waterLevel}% | Happiness: ${happinessLevel}%.`];
        }
        return [statusShort, ...text, score].join("\n");
    }
    stringifyStatusShort(lisaData) {
        if (!lisaData.life.isAlive) {
            return "is dead.";
        }
        const relativeState = this.lisaStatusService.getRelativeState(lisaData);
        if (relativeState > RELATIVE_STATE_GOOD) {
            return "doing great.";
        }
        if (relativeState > RELATIVE_STATE_OK) {
            return "doing fine.";
        }
        return "close to dying.";
    }
    stringifyScore(lisaData) {
        const humanizedCurrentScore = this.humanizeDuration(this.lisaStatusService.getLifetime(lisaData));
        const humanizedHighScore = this.humanizeDuration(this.lisaStatusService.getHighScore(lisaData));
        const currentScoreTense = lisaData.life.isAlive
            ? "Current lifetime"
            : "Lifetime";
        return `${currentScoreTense}: ${humanizedCurrentScore} | Best lifetime: ${humanizedHighScore}.`;
    }
    humanizeDuration(duration) {
        return moment.duration(duration).humanize();
    }
}
lisaChevron.set(InjectableType.FACTORY, [LisaStatusService], LisaStringifyService);
export { LisaStringifyService };
//# sourceMappingURL=LisaStringifyService.js.map