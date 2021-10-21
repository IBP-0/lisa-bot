import type { PresenceData } from "discord.js";
import { inject, injectable } from "inversify";
import { filter, throttleTime } from "rxjs/operators";
import type { State } from "../../core/state/State";
import { StateController } from "../../core/state/StateController";
import { StatusTextService } from "../../core/status/StatusTextService";
import { rootLogger } from "../../logger";
import { TYPES } from "../../types";
import { DiscordClient } from "./DiscordClient";

const createPresence = (name: string): PresenceData => {
	return {
		activity: {
			name,
		},
	};
};

@injectable()
class DiscordEventController {
	private static readonly logger = rootLogger.child({
		target: DiscordEventController,
	});
	private static readonly PRESENCE_UPDATE_THROTTLE_TIMEOUT = 10000;
	private static readonly MESSAGE_THROTTLE_TIMEOUT = 1000;
	private static readonly MESSAGE_HAPPINESS_MODIFIER = 0.25;
	private static readonly DISCORD_ACTIVITY_INITIATOR = "Discord activity";

	readonly #stateController: StateController;
	readonly #discordClient: DiscordClient;
	readonly #statusTextService: StatusTextService;

	constructor(
		@inject(TYPES.StateController)
		stateController: StateController,
		@inject(TYPES.DiscordClient) discordClient: DiscordClient,
		@inject(TYPES.StatusTextService) statusTextService: StatusTextService
	) {
		this.#statusTextService = statusTextService;
		this.#discordClient = discordClient;
		this.#stateController = stateController;
	}

	bindListeners(): void {
		this.#discordClient
			.getMessageObservable()
			.pipe(
				filter((message) => !message.system && !message.author.bot),
				throttleTime(DiscordEventController.MESSAGE_THROTTLE_TIMEOUT)
			)
			.subscribe(() => this.#onMessage());

		this.#stateController.stateChangeSubject
			.pipe(
				throttleTime(
					DiscordEventController.PRESENCE_UPDATE_THROTTLE_TIMEOUT
				)
			)
			.subscribe((state) => this.#onStateChange(state));
		this.#onStateChange(this.#stateController.getStateCopy());
	}

	#onMessage(): void {
		DiscordEventController.logger.silly(
			"A message was sent, increasing happiness."
		);
		this.#stateController.modifyLisaStatus(
			0,
			DiscordEventController.MESSAGE_HAPPINESS_MODIFIER,
			DiscordEventController.DISCORD_ACTIVITY_INITIATOR
		);
	}

	#onStateChange(state: State): void {
		const statusLabel = `${this.#statusTextService.createStatusLabel(
			state
		)}.`;
		DiscordEventController.logger.debug(
			`Updating presence to '${statusLabel}'...`
		);
		this.#discordClient
			.setPresence(createPresence(statusLabel))
			.then(() =>
				DiscordEventController.logger.debug("Updated presence.")
			)
			.catch((e) =>
				DiscordEventController.logger.error(
					"Could not update presence.",
					e
				)
			);
	}
}

export { DiscordEventController };
