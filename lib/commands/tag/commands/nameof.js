"use strict";

const convertMember = require("../lib/convertMember");

/**
 * nameof command
 *
 * @param {Array<any>} dataRaw
 * @returns {string}
 */
module.exports = (dataRaw) => {
    if (dataRaw.length === 0) {
        return new Error("no id");
    } else if (dataRaw.length > 1) {
        return new Error("too many args");
    } else {
        const discord = this.data.discord;
        const memberResolvable = this.execItem(dataRaw[0]);
        const member = discord.app.util.resolveMember(memberResolvable, discord.msg.guild);

        if (member) {
            return convertMember(member).__default;
        } else {
            return new Error("not found");
        }
    }
};
