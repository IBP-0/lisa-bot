import { isNil } from "lodash";
import { chevron } from "./chevron";
import { rootLogger } from "./logger";
import { isProductionMode } from "./mode";

const logger = rootLogger.child({});

const DISCORD_TOKEN = isProductionMode()
    ? process.env.DISCORD_TOKEN
    : process.env.DISCORD_TOKEN_TEST;
if (isNil(DISCORD_TOKEN)) {
    throw new Error("No token set.");
}

logger.info("hi!");
chevron.hasInjectable("foo");
