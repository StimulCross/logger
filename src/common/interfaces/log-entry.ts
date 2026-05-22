import type { LogLevel } from '../enums/log-level.js'
import type { LoggerTimeDiffScope } from '../types/logger-time-diff-scope.js'

/**
 * A single log entry.
 */
export interface LogEntry {
	/**
	 * The severity level of the log entry.
	 */
	level: LogLevel

	/**
	 * The logger context.
	 */
	context: string

	/**
	 * The timestamp of the log entry.
	 */
	timestamp: number

	/**
	 * The log message arguments.
	 */
	args: unknown[]

	/**
	 * The application name.
	 */
	appName?: string

	/**
	 * The process ID.
	 *
	 * If the logger was created in a browser environment, this property will be `undefined`.
	 */
	pid?: number

	/**
	 * The time difference between the previous log entry and this one, in milliseconds.
	 *
	 * If {@link timeDiffScope} is not defined,
	 * this property represents global time difference across all logger instances.
	 */
	timeDiff: number

	/**
	 * The time difference scope.
	 *
	 * @remarks
	 * If not defined, the time difference is global across all logger instances.
	 */
	timeDiffScope: LoggerTimeDiffScope
}
