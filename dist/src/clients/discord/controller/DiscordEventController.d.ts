import { StateController } from "../../../core/controller/StateController";
import { StatusTextService } from "../../../core/service/StatusTextService";
import { DiscordClient } from "../DiscordClient";
declare class DiscordEventController {
    private static readonly logger;
    private static readonly PRESENCE_UPDATE_THROTTLE_TIMEOUT;
    private static readonly MESSAGE_THROTTLE_TIMEOUT;
    private static readonly MESSAGE_HAPPINESS_MODIFIER;
    private static readonly USER_DISCORD_ACTIVITY;
    private readonly lisaStateController;
    private readonly lisaDiscordClient;
    private readonly lisaTextService;
    constructor(lisaStateController: StateController, lisaDiscordClient: DiscordClient, lisaTextService: StatusTextService);
    bindListeners(): void;
    private onMessage;
    private onStateChange;
}
export { DiscordEventController };
