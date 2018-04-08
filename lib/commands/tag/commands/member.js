"use strict";

const isKey = require("ynajs/lib/types/isKey");
const convertMember = require("../lib/convertMember");

/**
 * member command
 *
 * @param {Array<any>} dataRaw
 * @returns {string}
 */
module.exports = (dataRaw) => {
    if (dataRaw.length === 0) {
        return new Error("no args");
    } else if (dataRaw.length === 1) {
        return new Error("no query");
    } else {
        const discord = this.data.discord;
        const key = this.execItem(dataRaw[0]);

        if (!isKey(key)) {
            return new Error("invalid key");
        } else {
            const memberResolvable = this.execItem(dataRaw[1]);
            const member = discord.app.util.resolveMember(memberResolvable, discord.msg.guild);

            if (member !== null) {
                this.keys.set(key, convertMember(member));

                return "";
            } else {
                return new Error("not found");
            }
        }
    }
};
