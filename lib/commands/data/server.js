"use strict";

module.exports = (args, msg, app) => [app.util.jsonToYaml(app.util.stripBotData(msg.guild)), "yaml"];
