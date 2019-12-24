import { DefaultBootstrappings, Injectable } from "chevronjs";
import { PresenceData } from "discord.js";
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
        service: LisaDiscordController
    });
    private static readonly PRESENCE_UPDATE_THROTTLE_TIMEOUT = 10000;
    private static readonly MESSAGE_HAPPINESS_MODIFIER = 0.25;

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaDiscordClient: LisaDiscordClient,
        private readonly lisaTextService: LisaTextService
    ) {
    }

    public bindEvents(): void {
        this.lisaDiscordClient.getCommandoClient().on("message", message => {
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
        this.lisaStateController.setHappiness(
            this.lisaStateController.getHappiness() +
            LisaDiscordController.MESSAGE_HAPPINESS_MODIFIER
        );
    }

    private onStateChange(): void {
        const presence = createPresence(
            this.lisaTextService.determineStatusLabel(
                this.lisaStateController.getStateCopy()
            )
        );
        this.lisaDiscordClient
            .getCommandoClient()
            .user.setPresence(presence)
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
