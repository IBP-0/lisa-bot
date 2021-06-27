import type { State } from "../state/State";
import { StatusService } from "./StatusService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

@injectable()
class StatusTextService {
    readonly #statusService: StatusService;

    constructor(@inject(TYPES.StatusService) statusService: StatusService) {
        this.#statusService = statusService;
    }

    public createStatusText(state: State): string {
        const statusLabel = `Lisa is ${this.createStatusLabel(state)}.`;
        const scoreText = this.createScoreText(state);
        let text: string;

        if (!this.#statusService.isAlive(state)) {
            const timeSinceDeathLabel = this.#statusService
                .getTimeSinceDeath(state)!
                .humanize();

            text = `Lisa died ${timeSinceDeathLabel} ago, she was killed by ${
                state.death.initiator ?? "anonymous"
            } through ${state.death.cause ?? "unknown cause"}.`;
        } else {
            const waterLevel = state.status.water.toFixed(2);
            const happinessLevel = state.status.happiness.toFixed(2);

            text = `Water: ${waterLevel}% | Happiness: ${happinessLevel}%.`;
        }

        return [statusLabel, text, scoreText].join("\n");
    }

    public createStatusLabel(state: State): string {
        if (!this.#statusService.isAlive(state)) {
            return "is dead";
        }

        const relativeIndex = this.#statusService.calculateRelativeIndex(state);
        if (relativeIndex > 0.666) {
            return "doing great";
        } else if (relativeIndex > 0.333) {
            return "doing fine";
        }
        return "close to dying";
    }

    private createScoreText(state: State): string {
        const lifetimeLabel = this.#statusService.getLifetime(state).humanize();
        const highScoreLabel = state.bestLifetimeDuration.humanize();
        const currentLabel = this.#statusService.isAlive(state)
            ? "Current lifetime"
            : "Lifetime";

        return `${currentLabel}: ${lifetimeLabel} | Best lifetime: ${highScoreLabel}.`;
    }
}

export { StatusTextService };
