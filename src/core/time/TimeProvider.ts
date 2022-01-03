import { injectable } from "inversify";
import { DateTime } from "luxon";

/**
 * Injectable for current time, makes testing easier.
 */
@injectable()
export class TimeProvider {
	/**
	 * Returns current time in UTC.
	 */
	now(): DateTime {
		return DateTime.now().toUTC();
	}
}
