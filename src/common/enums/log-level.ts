/**
 * Log severity levels.
 *
 * @remarks
 * Levels are ordered from highest severity to lowest.
 * A logger configured with a minimum level will output only messages at that level or above.
 *
 * Recommended Production levels: INFO or WARNING.
 */
export enum LogLevel {
	/**
	 * Unrecoverable crash. Logged immediately before the process terminates.
	 *
	 * Application execution is impossible due to critical initialization or runtime failures.
	 *
	 * @example Invalid configuration/ENV variables, uncaughtException, unhandledRejection.
	 */
	FATAL = 0,

	/**
	 * An operation has failed, but the application remains alive.
	 *
	 * Requires attention and investigation.
	 *
	 * @example API request failed, file read error.
	 */
	ERROR = 1,

	/**
	 * A potentially harmful, suspicious, or unexpected situation.
	 *
	 * The system handles it, but it may lead to errors later.
	 *
	 * @example High latency, deprecation warnings, high memory usage.
	 */
	WARNING = 2,

	/**
	 * System-level visual confirmation of a successfully executed milestone.
	 *
	 * Fully mirrors INFO severity, but intended for high-priority green-colored terminal output.
	 *
	 * @example Database connected, Server listening on port 3000, Build completed.
	 */
	SUCCESS = 3,

	/**
	 * General informational messages tracking application lifecycle.
	 *
	 * The default recommended level for production environments.
	 *
	 * @example Application initialization started, cron job triggered.
	 */
	INFO = 4,

	/**
	 * High-level technical events for development and troubleshooting.
	 *
	 * Useful for identifying systemic flows without raw data clutter.
	 *
	 * @example Cache hit, event listener attached, routing changed.
	 */
	DEBUG = 5,

	/**
	 * Detailed operational output, payload tracking, and raw data dumps.
	 *
	 * Lightweight alternative to TRACE without stack traces.
	 *
	 * @example HTTP request body, raw database query parameters.
	 */
	VERBOSE = 6,

	/**
	 * Extreme diagnostic output with step-by-step execution details.
	 *
	 * Intended for low-level debugging; uses `console.trace` for call stacks.
	 *
	 * @example Entering loop, variable mutations, full execution context.
	 */
	TRACE = 7,
}
