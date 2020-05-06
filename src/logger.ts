import { createLogger, format, transports } from "winston";
import { isProductionMode } from "./mode";

const logFormat = format.combine(
    format.timestamp(),
    format.printf(
        ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
    )
);

const rootLogger = createLogger({
    level: isProductionMode() ? "info" : "silly",
    format: logFormat,
    defaultMeta: { target: "root" },
    transports: [new transports.Console()],
});

if (isProductionMode()) {
    rootLogger.add(new transports.File({ filename: "log/lisa-bot.log" }));
}

export { rootLogger };
