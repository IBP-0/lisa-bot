import { InjectableType } from "chevronjs";
import { User } from "discord.js";
import * as moment from "moment";
import { lisaChevron } from "../../../di";
import { ILisaData } from "./ILisaData";
import { LisaStatusService } from "./LisaStatusService";

const RELATIVE_STATE_GOOD = 90;
const RELATIVE_STATE_OK = 40;

class LisaStringifyService {
    private readonly lisaStatusService: LisaStatusService;

    constructor(lisaStatusService: LisaStatusService) {
        this.lisaStatusService = lisaStatusService;
    }

    public stringifyStatus(lisaData: ILisaData): string {
        const statusShort = `Lisa is ${this.stringifyStatusShort(lisaData)}`;
        const score = this.stringifyScore(lisaData);
        let text: string[] = [];

        if (!lisaData.life.isAlive) {
            const humanizedTimeSinceDeath = this.humanizeDuration(
                this.lisaStatusService.getTimeSinceDeath(lisaData)
            );
            const humanizedLifetime = this.humanizeDuration(
                this.lisaStatusService.getLifetime(lisaData)
            );

            text = [
                `Lisa died ${humanizedTimeSinceDeath} ago, and was alive for ${humanizedLifetime}.`,
                `She was killed by ${lisaData.life.killer} through ${
                    lisaData.life.deathThrough
                }.`
            ];
        } else {
            const waterLevel = Math.floor(lisaData.status.water);
            const happinessLevel = Math.floor(lisaData.status.happiness);

            text = [`Water: ${waterLevel}% | Happiness: ${happinessLevel}%.`];
        }

        return [statusShort, ...text, score].join("\n");
    }

    public stringifyStatusShort(lisaData: ILisaData): string {
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

    private stringifyScore(lisaData: ILisaData): string {
        const humanizedCurrentScore = this.humanizeDuration(
            this.lisaStatusService.getLifetime(lisaData)
        );
        const humanizedHighScore = this.humanizeDuration(
            this.lisaStatusService.getHighScore(lisaData)
        );

        const currentScoreTense = lisaData.life.isAlive
            ? "Current lifetime"
            : "Lifetime";
        return `${currentScoreTense}: ${humanizedCurrentScore} | Best lifetime: ${humanizedHighScore}.`;
    }

    private humanizeDuration(duration: number): string {
        return moment.duration(duration).humanize();
    }
}

lisaChevron.set(
    InjectableType.FACTORY,
    [LisaStatusService],
    LisaStringifyService
);

export { LisaStringifyService };
