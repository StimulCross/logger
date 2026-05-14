import { type LogLevel } from '../enums/log-level.js';
import { type LazyLogFn } from '../types/lazy-log-fn.js';

/**
 * Provides lazy evaluation capabilities for logging.
 *
 * Methods in this class accept a closure {@link LazyLogFn} that returns the data to be logged.
 * The closure is only executed if the current minimum log level allows the message to be emitted,
 * preventing expensive computations or allocations when the log is ignored.
 */
export interface LazyLogger {
	/**
	 * Logs a lazily evaluated message with the specified severity level.
	 *
	 * @param level The severity of the message. Messages below the current minimum log level are ignored.
	 * @param fn A function returning the data to be logged. Executed only if the log level is met.
	 */
	log(level: LogLevel, fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated fatal failure message.
	 *
	 * Use this method for unrecoverable failures that make further application execution impossible
	 * and usually happen immediately before process termination.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	fatal(fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated error message.
	 *
	 * Use this method for failed operations that require attention or investigation, while the
	 * application can still continue running.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	error(fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated warning message.
	 *
	 * Use this method for unexpected, suspicious, or potentially harmful situations that were handled
	 * successfully but may indicate future errors or degraded behavior.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	warn(fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated success message.
	 *
	 * Use this method to highlight an important completed milestone or a successful operation that
	 * should be clearly visible in normal console output.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	success(fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated informational message.
	 *
	 * Use this method for normal application lifecycle events, state transitions, and other
	 * user-relevant messages that do not indicate a problem.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	info(fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated debug message.
	 *
	 * Use this method for high-level technical events that help developers understand control flow,
	 * decisions, and subsystem interactions during troubleshooting.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	debug(fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated verbose diagnostic message.
	 *
	 * Use this method for detailed operational output, payload inspection, and intermediate values
	 * that are useful during deep troubleshooting but too noisy for regular debug logs.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	verbose(fn: LazyLogFn): void;

	/**
	 * Logs a lazily evaluated trace message.
	 *
	 * Use this method for the most detailed execution diagnostics, including step-by-step flow,
	 * low-level operations, and data needed to reconstruct how a specific result was produced.
	 *
	 * @param fn A function returning the data to be logged.
	 */
	trace(fn: LazyLogFn): void;
}
