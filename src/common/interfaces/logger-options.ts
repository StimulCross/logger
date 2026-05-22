import type { LogLevel } from '../enums/log-level.js'
import type { ColorVariant } from '../types/color-variant.js'
import type { LoggerDateTimeFormatter } from '../types/logger-date-time-formatter.js'
import type { LoggerOverride } from '../types/logger-override.js'
import type { LoggerTimeDiffScope } from '../types/logger-time-diff-scope.js'
import type { LoggerDateTimeFormatOptions } from './logger-date-time-format-options.js'
import type { LoggerInspectOptions } from './logger-inspect-options.js'

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
	applicationName?: string

	/**
	 * Logger context (e.g., module, subsystem, or service name).
	 */
	context: string

	/**
	 * Minimum log level.
	 * Messages below this level are ignored.
	 *
	 * @default SUCCESS
	 */
	minLevel?: LogLevel | keyof typeof LogLevel | Lowercase<keyof typeof LogLevel>

	/**
	 * Whether to include the process ID.
	 *
	 * @remarks
	 * Effective only in Node.js, Deno, and Bun runtimes; ignored in the browser.
	 *
	 * @default true
	 */
	pid?: boolean

	/**
	 * Enables colored output.
	 *
	 * Support the following variants:
	 *   - `standard` - standard ANSI colors (default);
	 *   - `bright` - bright ANSI colors
	 *
	 * If a boolean is provided, `true` enables standard colors, `false` disables colored output.
	 *
	 * @remarks
	 * This option is ignored in the browsers that are not based on Chromium as they do not support ANSI escape codes.
	 *
	 * @default standard
	 */
	colors?: ColorVariant | boolean

	/**
	 * Enables timestamp output.
	 *
	 * @remarks
	 * Timestamps use the local timezone by default. To customize the format,
	 * use {@link LoggerOptions.dateTimeFormat}.
	 *
	 * @default true
	 */
	timestamps?: boolean

	/**
	 * Formatting options or a custom formatting function for timestamp output.
	 *
	 * @remarks
	 * Passed directly to `Intl.DateTimeFormat`.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
	 */
	dateTimeFormat?: LoggerDateTimeFormatter | LoggerDateTimeFormatOptions

	/**
	 * Custom logger implementation that overrides default behavior.
	 */
	custom?: LoggerOverride

	/**
	 * Specifies options for `inspect()` when formatting log arguments.
	 *
	 * @remarks
	 * Effective only in Node.js, Deno, and Bun runtimes; ignored in the browser.
	 *
	 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
	 *
	 * @default { depth: null }
	 */
	inspectOptions?: LoggerInspectOptions

	/**
	 * Configures time-difference tracking between consecutive log entries.
	 *
	 * @remarks
	 * Accepts `global` to measure deltas across all logger instances or `local` to
	 * keep measurements scoped to the current instance, mirroring the behavior popularized
	 * by NestJS for bootstrap and operation timing.
	 */
	timeDiff?: LoggerTimeDiffScope
}
