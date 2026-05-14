import { type LogLevel } from '../enums/log-level.js';

/**
 * Configuration for a custom logger implementation.
 *
 * @remarks
 * Provides hooks to override the default behavior of individual log methods.
 * At minimum, a custom logger must implement the generic `log` function.
 * All other methods are optional; if omitted, they fall back to using `log`.
 */
export interface LoggerOverrideConfig {
	/**
	 * Handles a log message of the given severity.
	 *
	 * @param level The severity level.
	 * @param args  Data to be logged.
	 */
	log: (level: LogLevel, ...args: unknown[]) => void;

	/**
	 * Handles fatal-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route fatal messages through `log`.
	 */
	fatal?: (...args: unknown[]) => void;

	/**
	 * Handles error-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route error messages through `log`.
	 */
	error?: (...args: unknown[]) => void;

	/**
	 * Handles warning-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route warnings through `log`.
	 */
	warn?: (...args: unknown[]) => void;

	/**
	 * Handles success-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route success messages through `log`.
	 */
	success?: (...args: unknown[]) => void;

	/**
	 * Handles informational messages.
	 *
	 * @remarks
	 * If omitted, the logger will route info messages through `log`.
	 */
	info?: (...args: unknown[]) => void;

	/**
	 * Handles debug-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route debug messages through `log`.
	 */
	debug?: (...args: unknown[]) => void;

	/**
	 * Handles verbose-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route debug messages through `log`.
	 */
	verbose?: (...args: unknown[]) => void;

	/**
	 * Handles trace-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route trace messages through `log`.
	 */
	trace?: (...args: unknown[]) => void;
}
