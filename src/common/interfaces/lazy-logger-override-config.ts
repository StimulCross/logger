import type { LogLevel } from '../enums/log-level.js'
import type { LazyLogFn } from '../types/lazy-log-fn.js'

/**
 * Configuration for a custom lazy logger implementation.
 *
 * @remarks
 * Provides hooks to override the default behavior of individual log methods.
 * At minimum, a custom lazy logger must implement the generic `log` function.
 * All other methods are optional; if omitted, they fall back to using `log`.
 */
export interface LazyLoggerOverrideConfig {
	/**
	 * Handles a log message of the given severity.
	 */
	log: (level: LogLevel, fn: LazyLogFn) => void

	/**
	 * Handles fatal-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route fatal messages through `log`.
	 */
	fatal?: (fn: LazyLogFn) => void

	/**
	 * Handles error-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route error messages through `log`.
	 */
	error?: (fn: LazyLogFn) => void

	/**
	 * Handles warning-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route warnings through `log`.
	 */
	warn?: (fn: LazyLogFn) => void

	/**
	 * Handles success-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route success messages through `log`.
	 */
	success?: (fn: LazyLogFn) => void

	/**
	 * Handles info-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route info messages through `log`.
	 */
	info?: (fn: LazyLogFn) => void

	/**
	 * Handles debug-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route debug messages through `log`.
	 */
	debug?: (fn: LazyLogFn) => void

	/**
	 * Handles verbose-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route debug messages through `log`.
	 */
	verbose?: (fn: LazyLogFn) => void

	/**
	 * Handles trace-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route trace messages through `log`.
	 */
	trace?: (fn: LazyLogFn) => void
}
