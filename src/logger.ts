import { createLogger, format, transports } from "winston";
import { DEVELOPMENT } from "./mode";

const logFormat = format.combine(
    format.timestamp(),
    format.printf(
        ({ level, message, timestamp }) =>
            `${timestamp as number} [${level}]: ${message}`
    )
);

const rootLogger = createLogger({
    level: DEVELOPMENT ? "silly" : "info",
    format: logFormat,
    defaultMeta: { target: "root" },
    transports: [new transports.Console()],
});

if (!DEVELOPMENT) {
    rootLogger.add(new transports.File({ filename: "log/lisa-bot.log" }));
}

export { rootLogger };
