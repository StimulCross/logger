import { type InspectOptions } from 'node:util';
import { type LogLevel } from '../enums/log-level.js';
import { type DateTimeFormatter } from '../types/datetime-formatter.js';
import { type LoggerOverride } from '../types/logger-override.js';
import { type LoggerTimeDiffScope } from '../types/logger-time-diff-scope.js';

/**
 * An interface extending `Intl.DateTimeFormatOptions` to configure formatting of date and time.
 *
 * This interface allows specifying options for customizing the output of date and
 * time in a localized format, with an optional `locale` property to explicitly
 * define the desired locale.
 */
export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
	/**
	 * The locale identifier for the desired locale.
	 */
	locale?: string;
}

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
	 * Messages below this level are ignored.
	 *
	 * @default SUCCESS
	 */
	minLevel?: LogLevel | keyof typeof LogLevel | Lowercase<keyof typeof LogLevel>;

	/**
	 * Whether to include the process ID.
	 *
	 * @remarks
	 * Effective only in Node.js, Deno, and Bun runtimes; ignored in the browser.
	 *
	 * @default `true`
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
	 * use {@link LoggerOptions.dateTimeFormat}.
	 *
	 * @default `true`
	 */
	timestamps?: boolean;

	/**
	 * Formatting options or a custom formatting function for timestamp output.
	 *
	 * @remarks
	 * Passed directly to `Intl.DateTimeFormat`.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
	 */
	dateTimeFormat?: DateTimeFormatter | DateTimeFormatOptions;

	/**
	 * Custom logger implementation that overrides default behavior.
	 */
	custom?: LoggerOverride;

	/**
	 * Specifies options for `inspect()` when formatting log arguments.
	 *
	 * @remarks
	 * Effective only in Node.js, Deno, and Bun runtimes; ignored in the browser.
	 *
	 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
	 *
	 * @default { depth: null, colors: true }
	 */
	inspectOptions?: InspectOptions;

	/**
	 * Configures time-difference tracking between consecutive log entries.
	 *
	 * @remarks
	 * Accepts `global` to measure deltas across all logger instances or `local` to
	 * keep measurements scoped to the current instance, mirroring the behavior popularized
	 * by NestJS for bootstrap and operation timing.
	 */
	timeDiff?: LoggerTimeDiffScope;
}
