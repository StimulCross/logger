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
	FATAL,

	/**
	 * An operation has failed and requires attention.
	 */
	ERROR,

	/**
	 * A potentially harmful or unexpected situation.
	 */
	WARNING,

	/**
	 * Confirmation that an operation completed successfully.
	 */
	SUCCESS,

	/**
	 * General informational messages.
	 */
	INFO,

	/**
	 * Debug information intended for development and troubleshooting.
	 */
	DEBUG,

	/**
	 * Highly detailed diagnostic output.
	 */
	TRACE,
}
