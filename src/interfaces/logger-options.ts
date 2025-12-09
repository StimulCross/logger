import { type LogLevel } from '../enums/log-level';
import { type LoggerOverride } from '../types/logger-override';

/**
 * Configuration options for the logger.
 *
 * @remarks
 * Some options apply only in Node.js. In browser environments they are safely ignored.
 */
export interface LoggerOptions {
	/**
	 * Name of the application.
	 *
	 * @remarks
	 * Placed at the start of each log entry. Useful when multiple applications write to the same output.
	 */
	applicationName?: string;

	/**
	 * Logger context (e.g., module, subsystem, or service name).
	 */
	context: string;

	/**
	 * Minimum log level.
	 *
	 * @remarks
	 * Messages below this level are discarded.
	 *
	 * @defaultValue SUCCESS
	 */
	minLevel?: LogLevel | keyof typeof LogLevel;

	/**
	 * Whether to include the process ID.
	 *
	 * @remarks
	 * Effective only in Node.js; ignored in the browser.
	 *
	 * @defaultValue `true`
	 */
	pid?: boolean;

	/**
	 * Enables colored output.
	 */
	colors?: boolean;

	/**
	 * Enables timestamp output.
	 *
	 * @remarks
	 * Timestamps use the local timezone by default. To customize the format,
	 * use {@link LoggerOptions.dateTimeFormatOptions}.
	 *
	 * @defaultValue `true`
	 */
	timestamps?: boolean;

	/**
	 * Formatting options for timestamp output.
	 *
	 * @remarks
	 * Passed directly to `Intl.DateTimeFormat`.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
	 */
	dateTimeFormatOptions?: Intl.DateTimeFormatOptions;

	/**
	 * Custom logger implementation that overrides default behavior.
	 */
	custom?: LoggerOverride;

	/**
	 * Enables pretty-printing of objects and arrays.
	 *
	 * @remarks
	 * Ignored in the browser.
	 *
	 * @defaultValue `true`
	 */
	prettifyObjects?: boolean;

	/**
	 * Appends the time difference since the previous log message.
	 *
	 * @remarks
	 * Similar to the behavior used in NestJS. Useful for measuring bootstrap
	 * or operation timing.
	 *
	 * @defaultValue `false`
	 */
	timeDiff?: boolean;
}
