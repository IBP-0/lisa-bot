import { DefaultBootstrappings, Injectable } from "chevronjs";
import { Message, PresenceData } from "discord.js";
import { Observable } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../../chevron";
import { LisaStateController } from "../../lisa/LisaStateController";
import { LisaTextService } from "../../lisa/service/LisaTextService";
import { rootLogger } from "../../logger";
import { LisaDiscordClient } from "./LisaDiscordClient";

const createPresence = (name: string): PresenceData => ({
    game: {
        name
    }
});

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStateController, LisaDiscordClient, LisaTextService]
})
class LisaDiscordController {
    private static readonly logger = rootLogger.child({
        target: LisaDiscordController
    });
    private static readonly PRESENCE_UPDATE_THROTTLE_TIMEOUT = 10000;
    private static readonly MESSAGE_THROTTLE_TIMEOUT = 1000;
    private static readonly MESSAGE_HAPPINESS_MODIFIER = 0.25;

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaDiscordClient: LisaDiscordClient,
        private readonly lisaTextService: LisaTextService
    ) {}

    public bindListeners(): void {
        this.lisaDiscordClient
            .getMessageObservable()
            .pipe(throttleTime(LisaDiscordController.MESSAGE_THROTTLE_TIMEOUT))
            .subscribe((message: Message) => {
                if (!message.system && !message.author.bot) {
                    this.onMessage();
                }
            });

        this.lisaStateController.stateChangeSubject
            .pipe(
                throttleTime(
                    LisaDiscordController.PRESENCE_UPDATE_THROTTLE_TIMEOUT
                )
            )
            .subscribe(() => this.onStateChange());
        this.onStateChange();
    }

    private onMessage(): void {
        LisaDiscordController.logger.silly(
            "A message was sent, increasing happiness."
        );
        const newHappiness =
            this.lisaStateController.getStateCopy().status.water +
            LisaDiscordController.MESSAGE_HAPPINESS_MODIFIER;
        this.lisaStateController.setHappiness(newHappiness, "Discord activity");
    }

    private onStateChange(): void {
        const statusLabel = this.lisaTextService.determineStatusLabel(
            this.lisaStateController.getStateCopy()
        );
        LisaDiscordController.logger.debug(
            `Updating presence to '${statusLabel}'.`
        );
        this.lisaDiscordClient
            .setPresence(createPresence(statusLabel))
            .then(() => LisaDiscordController.logger.debug("Updated presence."))
            .catch(e =>
                LisaDiscordController.logger.error(
                    "Could not update presence.",
                    e
                )
            );
    }
}

export { LisaDiscordController };
