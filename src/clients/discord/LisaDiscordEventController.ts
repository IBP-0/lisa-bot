import { DefaultBootstrappings, Injectable } from "chevronjs";
import { PresenceData } from "discord.js";
import { filter, throttleTime } from "rxjs/operators";
import { chevron } from "../../chevron";
import { LisaStateController } from "../../lisa/LisaStateController";
import { LisaTextService } from "../../lisa/service/LisaTextService";
import { rootLogger } from "../../logger";
import { LisaDiscordClient } from "./LisaDiscordClient";

const createPresence = (name: string): PresenceData => {
    return {
        activity: {
            name
        }
    };
};

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStateController, LisaDiscordClient, LisaTextService]
})
class LisaDiscordEventController {
    private static readonly logger = rootLogger.child({
        target: LisaDiscordEventController
    });
    private static readonly PRESENCE_UPDATE_THROTTLE_TIMEOUT = 10000;
    private static readonly MESSAGE_THROTTLE_TIMEOUT = 1000;
    private static readonly MESSAGE_HAPPINESS_MODIFIER = 0.25;
    private static readonly USER_DISCORD_ACTIVITY = "Discord activity";

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaDiscordClient: LisaDiscordClient,
        private readonly lisaTextService: LisaTextService
    ) {}

    public bindListeners(): void {
        this.lisaDiscordClient
            .getMessageObservable()
            .pipe(
                filter(message => !message.system && !message.author.bot),
                throttleTime(
                    LisaDiscordEventController.MESSAGE_THROTTLE_TIMEOUT
                )
            )
            .subscribe(() => this.onMessage());

        this.lisaStateController.stateChangeSubject
            .pipe(
                throttleTime(
                    LisaDiscordEventController.PRESENCE_UPDATE_THROTTLE_TIMEOUT
                )
            )
            .subscribe(() => this.onStateChange());
        this.onStateChange();
    }

    private onMessage(): void {
        LisaDiscordEventController.logger.silly(
            "A message was sent, increasing happiness."
        );
        this.lisaStateController.modifyLisaStatus(
            0,
            LisaDiscordEventController.MESSAGE_HAPPINESS_MODIFIER,
            LisaDiscordEventController.USER_DISCORD_ACTIVITY
        );
    }

    private onStateChange(): void {
        const statusLabel = `${this.lisaTextService.createStatusLabel(
            this.lisaStateController.getStateCopy()
        )}.`;
        LisaDiscordEventController.logger.debug(
            `Updating presence to '${statusLabel}'...`
        );
        this.lisaDiscordClient
            .setPresence(createPresence(statusLabel))
            .then(() =>
                LisaDiscordEventController.logger.debug("Updated presence.")
            )
            .catch(e =>
                LisaDiscordEventController.logger.error(
                    "Could not update presence.",
                    e
                )
            );
    }
}

export { LisaDiscordEventController };
