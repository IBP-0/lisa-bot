import { User } from "discord.js";
import { LisaStateController } from "../../lisa/LisaStateController";
import { LisaStatusService } from "../../lisa/service/LisaStatusService";
import { LisaTextService } from "../../lisa/service/LisaTextService";
declare class LisaDiscordCommandController {
    private readonly lisaStateController;
    private readonly lisaStatusService;
    private readonly lisaTextService;
    private static readonly logger;
    constructor(lisaStateController: LisaStateController, lisaStatusService: LisaStatusService, lisaTextService: LisaTextService);
    performAction(author: User, waterModifier: number, happinessModifier: number, allowedIds: string[] | null, textSuccess: string[], textDead: string[], textNotAllowed?: string[]): string;
    createStatusText(): string;
    private getFullUserName;
}
export { LisaDiscordCommandController };
