'use strict';

var lodash = require('lodash');
var chevronjs = require('chevronjs');
var winston = require('winston');

const chevron = new chevronjs.Chevron();

const isProductionMode = () => process.env.NODE_ENV === "production";

const rootLogger = winston.createLogger({
    level: isProductionMode() ? "info" : "debug",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
    ]
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!isProductionMode()) {
    rootLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

const logger = rootLogger.child({});
const DISCORD_TOKEN = isProductionMode()
    ? process.env.DISCORD_TOKEN
    : process.env.DISCORD_TOKEN_TEST;
if (lodash.isNil(DISCORD_TOKEN)) {
    throw new Error("No token set.");
}
logger.info("hi!");
chevron.hasInjectable("foo");
//# sourceMappingURL=lisa-bot.common.js.map
