import type { LoggerOverride } from './CustomLoggerWrapper';
import type { LogLevel } from './LogLevel';

/**
 * Logger options.
 *
 * @remarks
 * Some options are designed only for the NodeJS environment and will be ignored in the browser environment.
 */
export interface LoggerOptions {
	/**
	 * Application name.
	 *
	 * @remarks
	 * Appears at the beginning of the output line. May be useful for distinguishing between applications.
	 */
	applicationName?: string;

	/**
	 * Logger context or scope.
	 */
	context: string;

	/**
	 * Minimum log level.
	 *
	 * @remarks
	 * All messages below this level will be ignored.
	 *
	 * @defaultValue `SUCCESS`
	 */
	minLevel?: LogLevel | keyof typeof LogLevel | string;

	/**
	 * The process ID.
	 *
	 * @remarks
	 * If enabled, prints the process ID.
	 *
	 * This option is ignored in the browser environment.
	 *
	 * @defaultValue `true`
	 */
	pid?: boolean;

	/**
	 * Whether to enable colors.
	 *
	 * This option is ignored in the browser environment.
	 */
	colors?: boolean;

	/**
	 * Whether to enable timestamps.
	 *
	 * @remarks
	 * By default, the timestamps are formatted to the local string with local time. You can change this behavior
	 * providing {@link LoggerOptions#dateTimeFormatOptions} property.
	 *
	 * This option is ignored in the browser environment.
	 *
	 * @defaultValue `true`
	 */
	timestamps?: boolean;

	/**
	 * Formatting options for timestamps.
	 *
	 * @remarks
	 * These options are implement `DateTimeFormatOptions` of `Intl` object.
	 *
	 * This option is ignored in the browser environment.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
	 */
	dateTimeFormatOptions?: Intl.DateTimeFormatOptions;

	/**
	 * Custom logger.
	 */
	custom?: LoggerOverride;

	/**
	 * Whether to prettify objects and arrays.
	 *
	 * This option is ignored in the browser environment.
	 *
	 * @defaultValue `true`
	 */
	prettifyObjects?: boolean;

	/**
	 * Whether to add the time difference from the previous message to the end of the message.
	 *
	 * @remarks
	 * This option is similar to NestJS and, for example, allows you to evaluate bootstrap speed.
	 *
	 * @defaultValue `false`
	 */
	timeDiff?: boolean;
}
