import * as winston from "winston";
import { isProductionMode } from "./mode";
const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`));
const rootLogger = winston.createLogger({
    level: isProductionMode() ? "info" : "silly",
    format: logFormat,
    defaultMeta: { target: "root" },
    transports: [new winston.transports.File({ filename: "log/lisa-bot.log" })]
});
if (!isProductionMode()) {
    rootLogger.add(new winston.transports.Console());
}
export { rootLogger };
//# sourceMappingURL=logger.js.map