"use strict";

const {
    merge
} = require("lodash");
const convertMember = require("./convertMember");
const convertChannel = require("./convertChannel");
const convertServer = require("./convertServer");


/**
 * Creates a ctx for a msg
 *
 * @param {Message} msg
 * @param {Member} creatorMember
 * @param {Object} tagData
 * @param {number} tagUses
 * @param {string} tagName
 * @returns {Object}
 */
module.exports = function (msg, creatorMember, tagData, tagUses, tagName) {
    const me = convertMember(creatorMember);
    const member = convertMember(msg.member);
    const channel = convertChannel(msg.channel);
    const server = convertServer(msg.channel.guild);
    const result = {
        me: me,
        meid: me.id,
        caller: member,
        callerid: member.id,
        channel: channel,
        channelid: channel.id,
        server: server,
        serverid: server.id,
        tag: tagName,
        uses: tagUses
    };

    return merge(result, tagData);
};
