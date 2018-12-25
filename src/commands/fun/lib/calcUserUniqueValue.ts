import { User } from "discord.js";
import { lisaLogby } from "../../../logger";

const logger = lisaLogby.getLogger("calcUserUniqueValue");

const ID_LIMIT = 6;
const SIZE_LIMIT = 10;

/**
 * Returns the decimal values of a number as a string.
 *
 * @param val Value to use
 * @return Decimal values as a string.
 */
const getDecimalsAsString = (val: number): string => {
    const str = val.toString();
    return str.slice(str.indexOf(".") + 1);
};

/**
 * Fits a string to the given size. if it is smaller than the limit, its repeated. if its longer, its cut of.
 *
 * @param str String to fit.
 * @param limit Limit to use for fitting.
 * @return Fitted string.
 */
const fitStringToSize = (str: string, limit: number): string => {
    let result = str;

    if (result.length < limit) {
        result = result.repeat(Math.ceil(limit / result.length));
    }
    if (result.length > limit) {
        result = result.slice(0, limit);
    }

    return result;
};

/**
 * Create an unique value for a user, which is a string with the length 10, containing numbers.
 * We _could_ use actual hashing or something here but that seems overkill.
 *
 * @param user User to create the value for.
 * @return The unique value.
 */
const calcUserUniqueValue = (user: User): string => {
    const idPart = Number(user.id.slice(ID_LIMIT));
    let discriminator = Number(user.discriminator);

    let result: string;

    // Fall back if something goes wrong, rather than getting a runtime exception later.
    if (Number.isNaN(idPart) || Number.isNaN(discriminator)) {
        logger.warn(
            "Could not properly calculate unique value:",
            idPart,
            discriminator
        );
        result = user.id;
    } else {
        const seed = Math.abs((Math.sin(discriminator) * Math.cos(idPart)) / 2);

        result = getDecimalsAsString(seed);
    }

    return fitStringToSize(result, SIZE_LIMIT);
};

export { calcUserUniqueValue };
