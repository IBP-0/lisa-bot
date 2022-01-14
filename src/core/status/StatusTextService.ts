import { inject, injectable } from "inversify";
import type { Duration } from "luxon";
import { TYPES } from "../../types";
import type { State } from "../state/State";
import { StatusService } from "./StatusService";

@injectable()
class StatusTextService {
	readonly #statusService: StatusService;

	constructor(@inject(TYPES.StatusService) statusService: StatusService) {
		this.#statusService = statusService;
	}

	createStatusText(state: State): string {
		const statusLabel = `Lisa is ${this.createStatusLabel(state)}.`;
		const scoreText = this.#createScoreText(state);
		let text: string;

		if (!this.#statusService.isAlive(state)) {
			const timeSinceDeathLabel = this.#humanizeDuration(
				this.#statusService.getTimeSinceDeath(state)!
			);

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

	createStatusLabel(state: State): string {
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

	#createScoreText(state: State): string {
		const lifetimeLabel = this.#humanizeDuration(
			this.#statusService.getLifetime(state)
		);
		const highScoreLabel = this.#humanizeDuration(
			state.bestLifetimeDuration
		);
		const currentLabel = this.#statusService.isAlive(state)
			? "Current lifetime"
			: "Lifetime";

		return `${currentLabel}: ${lifetimeLabel} | Best lifetime: ${highScoreLabel}.`;
	}

	#humanizeDuration(duration: Duration): string {
		return duration
			.shiftTo("days", "hours", "minutes", "seconds")
			.toHuman({ maximumFractionDigits: 0 });
	}
}

export { StatusTextService };
