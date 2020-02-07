import { Injectable } from "chevronjs";
import { PresenceData } from "discord.js";
import { filter, throttleTime } from "rxjs/operators";
import { chevron } from "../../../chevron";
import { LisaStateController } from "../../../lisa/controller/LisaStateController";
import { LisaState } from "../../../lisa/LisaState";
import { LisaTextService } from "../../../lisa/service/LisaTextService";
import { rootLogger } from "../../../logger";
import { DiscordClient } from "../DiscordClient";

const createPresence = (name: string): PresenceData => {
    return {
        activity: {
            name,
        },
    };
};

@Injectable(chevron, {
    dependencies: [LisaStateController, DiscordClient, LisaTextService],
})
class DiscordEventController {
    private static readonly logger = rootLogger.child({
        target: DiscordEventController,
    });
    private static readonly PRESENCE_UPDATE_THROTTLE_TIMEOUT = 10000;
    private static readonly MESSAGE_THROTTLE_TIMEOUT = 1000;
    private static readonly MESSAGE_HAPPINESS_MODIFIER = 0.25;
    private static readonly USER_DISCORD_ACTIVITY = "Discord activity";

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaDiscordClient: DiscordClient,
        private readonly lisaTextService: LisaTextService
    ) {}

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
