"use strict";

/**
 * convert member
 *
 * @param {Member}
 * @returns {Object}
 */
module.exports = (member) => {
    const user = member.user;

    return {
        __default: `${user.username}#${user.discriminator}`,

        name: user.username,
        id: user.id,
        discriminator: user.discriminator,
        avatar: user.avatar,
        bot: user.bot,
        avatar_url: user.avatarURL,
        mention: `<@${user.id}>`,
        created_at: user.createdTimestamp,
        display_name: member.displayName,
        joined_at: member.joinedTimestamp,
        status: user.presence.status,
        server: member.guild.name,
        nick: member.nickname,
    };
};
