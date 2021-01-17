import type { PresenceData } from "discord.js";
import { filter, throttleTime } from "rxjs/operators";
import type { StateController } from "../../core/state/StateController";
import type { LisaState } from "../../core/state/LisaState";
import type { StatusTextService } from "../../core/status/StatusTextService";
import { rootLogger } from "../../logger";
import type { DiscordClient } from "./DiscordClient";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

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
    private static readonly USER_DISCORD_ACTIVITY = "Discord activity";

    private readonly lisaStateController: StateController;
    private readonly lisaDiscordClient: DiscordClient;
    private readonly lisaTextService: StatusTextService;

    constructor(
        @inject(TYPES.LisaStateController)
        lisaStateController: StateController,
        @inject(TYPES.DiscordClient) lisaDiscordClient: DiscordClient,
        @inject(TYPES.LisaTextService) lisaTextService: StatusTextService
    ) {
        this.lisaTextService = lisaTextService;
        this.lisaDiscordClient = lisaDiscordClient;
        this.lisaStateController = lisaStateController;
    }

    public bindListeners(): void {
        this.lisaDiscordClient
            .getMessageObservable()
            .pipe(
                filter((message) => !message.system && !message.author.bot),
                throttleTime(DiscordEventController.MESSAGE_THROTTLE_TIMEOUT)
            )
            .subscribe(() => this.onMessage());

        this.lisaStateController.stateChangeSubject
            .pipe(
                throttleTime(
                    DiscordEventController.PRESENCE_UPDATE_THROTTLE_TIMEOUT
                )
            )
            .subscribe((state) => this.onStateChange(state));
        this.onStateChange(this.lisaStateController.getStateCopy());
    }

    private onMessage(): void {
        DiscordEventController.logger.silly(
            "A message was sent, increasing happiness."
        );
        this.lisaStateController.modifyLisaStatus(
            0,
            DiscordEventController.MESSAGE_HAPPINESS_MODIFIER,
            DiscordEventController.USER_DISCORD_ACTIVITY
        );
    }

    private onStateChange(state: LisaState): void {
        const statusLabel = `${this.lisaTextService.createStatusLabel(state)}.`;
        DiscordEventController.logger.debug(
            `Updating presence to '${statusLabel}'...`
        );
        this.lisaDiscordClient
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
