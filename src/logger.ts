import { dingyLogby } from "di-ngy";
import { createDelegatingAppender, defaultLoggingAppender, Logby } from "logby";

/**
 * Logby instance used by Di-ngy.
 */
const lisaLogby = new Logby();

lisaLogby.appenders.delete(defaultLoggingAppender);
lisaLogby.appenders.add(createDelegatingAppender(dingyLogby));

export { lisaLogby };
