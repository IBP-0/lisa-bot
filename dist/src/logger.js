"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const mode_1 = require("./mode");
const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`));
const rootLogger = winston.createLogger({
    level: mode_1.isProductionMode() ? "info" : "silly",
    format: logFormat,
    defaultMeta: { target: "root" },
    transports: [new winston.transports.File({ filename: "log/lisa-bot.log" })]
});
exports.rootLogger = rootLogger;
if (!mode_1.isProductionMode()) {
    rootLogger.add(new winston.transports.Console());
}
