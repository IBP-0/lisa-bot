import * as winston from "winston";
import { isProductionMode } from "./mode";

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
        ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
    )
);

const rootLogger = winston.createLogger({
    level: isProductionMode() ? "info" : "debug",
    format: logFormat,
    defaultMeta: { service: "root" },
    transports: [new winston.transports.File({ filename: "log/lisa-bot.log" })]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!isProductionMode()) {
    rootLogger.add(new winston.transports.Console());
}

export { rootLogger };
