import type { User } from "discord.js";
import { injectable } from "inversify";

@injectable()
class DiscordService {
    isUserAllowed(allowedUserIds: string[] | null, author: User): boolean {
        return allowedUserIds == null || allowedUserIds.includes(author.id);
    }
}

export { DiscordService };
