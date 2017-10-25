"use strict";

const convertMember = require("../lib/convertMember");

/**
 * user command
 *
 * @param {Array<any>} dataRaw
 * @returns {string}
 */
module.exports = function (dataRaw) {
    if (dataRaw.length > 0) {
        return new Error("too many args");
    } else {
        const discord = this.data.discord;

        const membersArr = discord.msg.guild.members.array();
        const randomMember = convertMember(membersArr[Math.floor(Math.random() * membersArr.length)]);

        return randomMember.__default;
    }
};
