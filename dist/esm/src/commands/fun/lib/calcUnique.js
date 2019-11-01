import { toFullName } from "di-ngy";
const SIZE_LIMIT = 10;
/**
 * Returns the decimal values of a number as a string.
 *
 * @param val Value to use
 * @return Decimal values as a string.
 */
const getDecimalsAsString = (val) => {
    const str = val.toString();
    return str.slice(str.indexOf(".") + 1);
};
/**
 * Fits a string to the given size. if it is smaller than the size, its repeated. if its longer, its cut of.
 *
 * @param str String to fit.
 * @param size Size to use for fitting.
 * @return Fitted string.
 */
const fitStringToSize = (str, size) => {
    let result = str;
    if (result.length < size) {
        result = result.repeat(Math.ceil(size / result.length));
    }
    if (result.length > size) {
        result = result.slice(0, size);
    }
    return result;
};
/**
 * Create an unique value for a string, which is a string with the length 10, containing numbers.
 * We _could_ use actual hashing or something here but that seems overkill.
 *
 * @param str String to create the value for.
 * @return The unique value.
 */
const calcUniqueString = (str) => {
    const seed = str
        .toLowerCase()
        .split("")
        .map(letter => letter.charCodeAt(0))
        .reduce((a, b) => Math.sin(a) + Math.cos(b));
    return fitStringToSize(getDecimalsAsString(seed), SIZE_LIMIT);
};
/**
 * Create an unique value for a user, which is a string with the length 10, containing numbers.
 *
 * @param user User to create the value for.
 * @return The unique value.
 */
const calcUserUniqueString = (user) => calcUniqueString(toFullName(user));
/**
 * Calculates a number from the given unique string.
 *
 * @param str String to use.
 * @param max Inclusive max value.
 * @return Unique number from 0 to max.
 */
const calcNumberFromUniqueString = (str, max = 10) => {
    const val = Number(str[0]);
    return Math.floor(((val + 1) / 10) * max);
};
export { calcUserUniqueString, calcUniqueString, calcNumberFromUniqueString };
//# sourceMappingURL=calcUnique.js.map