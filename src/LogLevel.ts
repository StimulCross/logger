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
	TRACE
}

/** @internal */
export function resolveLogLevel(level: string | keyof typeof LogLevel | LogLevel): LogLevel {
	if (typeof level === 'number') {
		if (Object.prototype.hasOwnProperty.call(LogLevel, level)) {
			return level;
		}
		const eligibleLevels = Object.keys(LogLevel)
			.map(k => parseInt(k, 10))
			.filter(k => !isNaN(k) && k < level);
		if (!eligibleLevels.length) {
			return LogLevel.WARNING;
		}
		return Math.max(...eligibleLevels);
	}

	const strLevel = level.toUpperCase() as keyof typeof LogLevel;

	if (!Object.prototype.hasOwnProperty.call(LogLevel, strLevel)) {
		throw new Error(`Unknown log level string: ${level}`);
	}

	return LogLevel[strLevel];
}
