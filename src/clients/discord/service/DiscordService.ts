import { Injectable } from "chevronjs";
import { User } from "discord.js";
import { chevron } from "../../../chevron";

@Injectable(chevron)
class DiscordService {
    public getFullUserName(user: User): string {
        return `${user.username}#${user.discriminator}`;
    }

    public isUserAllowed(
        allowedUserIds: string[] | null,
        author: User
    ): boolean {
        return allowedUserIds == null || allowedUserIds.includes(author.id);
    }
}

export { DiscordService };
