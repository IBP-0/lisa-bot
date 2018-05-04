"use strict";

const convertDate = require("./convertDate");

/**
 * convert channel
 *
 * @param {Channel}
 * @returns {Object}
 */
module.exports = (channel) => {
    return {
        __default: channel.name,

        name: channel.name,
        id: channel.id,
        position: channel.position,
        type: channel.type,
        mention: `<#${channel.id}>`,
        created_at: convertDate(channel.createdTimestamp)
    };
};
