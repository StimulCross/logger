/**
 * Log severity levels.
 *
 * @remarks
 * Levels are ordered from highest severity to lowest.
 * A logger configured with a minimum level will output only messages at that level or above.
 */
export enum LogLevel {
	/**
	 * Critical failure — the application cannot continue.
	 */
	FATAL = 0,

	/**
	 * An operation has failed and requires attention.
	 */
	ERROR = 1,

	/**
	 * A potentially harmful or unexpected situation.
	 */
	WARNING = 2,

	/**
	 * Confirmation that an operation completed successfully.
	 */
	SUCCESS = 3,

	/**
	 * General informational messages.
	 */
	INFO = 4,

	/**
	 * Debug information intended for development and troubleshooting.
	 */
	DEBUG = 5,

	/**
	 * Highly detailed diagnostic output.
	 */
	TRACE = 6,
}
