import { User } from "discord.js";
/**
 * Create an unique value for a string, which is a string with the length 10, containing numbers.
 * We _could_ use actual hashing or something here but that seems overkill.
 *
 * @param str String to create the value for.
 * @return The unique value.
 */
declare const calcUniqueString: (str: string) => string;
/**
 * Create an unique value for a user, which is a string with the length 10, containing numbers.
 *
 * @param user User to create the value for.
 * @return The unique value.
 */
declare const calcUserUniqueString: (user: User) => string;
/**
 * Calculates a number from the given unique string.
 *
 * @param str String to use.
 * @param max Inclusive max value.
 * @return Unique number from 0 to max.
 */
declare const calcNumberFromUniqueString: (str: string, max?: number) => number;
export { calcUserUniqueString, calcUniqueString, calcNumberFromUniqueString };
//# sourceMappingURL=calcUnique.d.ts.map