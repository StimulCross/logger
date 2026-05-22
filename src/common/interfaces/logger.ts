import type { LogLevel } from '../enums/log-level.js'
import type { LazyLogger } from './lazy-logger.js'
import type { LoggerOptions } from './logger-options.js'

/**
 * Cross-environment logger interface.
 *
 * Provides a unified API for structured logging across different runtimes (Node.js, browsers, etc.).
 * All log methods respect the currently configured minimum log level.
 */
export interface Logger {
	/**
	 * The current logger context.
	 */
	get context(): string

	/**
	 * The current minimum log level.
	 */
	get minLevel(): LogLevel

	/**
	 * Accesses the lazy logger interface.
	 *
	 * Provides methods that accept a function (thunk) instead of pre-evaluated arguments.
	 * Use this namespace to avoid expensive object cloning, formatting, or serialization
	 * (e.g., `JSON.stringify`) for logs that might be discarded by the current log level.
	 */
	get lazy(): LazyLogger

	/**
	 * Logs a message with the specified severity level.
	 *
	 * @param level The severity of the message. Messages below the current minimum log level are ignored.
	 * @param args Data to be logged.
	 */
	log: (level: LogLevel, ...args: unknown[]) => void

	/**
	 * Logs a fatal failure message.
	 *
	 * Use this method for unrecoverable failures that make further application execution impossible
	 * and usually happen immediately before process termination.
	 *
	 * @param args Data to be logged.
	 */
	fatal: (...args: unknown[]) => void

	/**
	 * Logs an error message.
	 *
	 * Use this method for failed operations that require attention or investigation, while the
	 * application can still continue running.
	 *
	 * @param args Data to be logged.
	 */
	error: (...args: unknown[]) => void

	/**
	 * Logs a warning message.
	 *
	 * Use this method for unexpected, suspicious, or potentially harmful situations that were handled
	 * successfully but may indicate future errors or degraded behavior.
	 *
	 * @param args Data to be logged.
	 */
	warn: (...args: unknown[]) => void

	/**
	 * Logs a success message.
	 *
	 * Use this method to highlight an important completed milestone or a successful operation that
	 * should be clearly visible in normal console output.
	 *
	 * @param args Data to be logged.
	 */
	success: (...args: unknown[]) => void

	/**
	 * Logs an informational message.
	 *
	 * Use this method for normal application lifecycle events, state transitions, and other
	 * user-relevant messages that do not indicate a problem.
	 *
	 * @param args Data to be logged.
	 */
	info: (...args: unknown[]) => void

	/**
	 * Logs a debug message.
	 *
	 * Use this method for high-level technical events that help developers understand control flow,
	 * decisions, and subsystem interactions during troubleshooting.
	 *
	 * @param args Data to be logged.
	 */
	debug: (...args: unknown[]) => void

	/**
	 * Logs a verbose diagnostic message.
	 *
	 * Use this method for detailed operational output, payload inspection, and intermediate values
	 * that are useful during deep troubleshooting but too noisy for regular debug logs.
	 *
	 * @param args Data to be logged.
	 */
	verbose: (...args: unknown[]) => void

	/**
	 * Logs a trace message.
	 *
	 * Use this method for the most detailed execution diagnostics, including step-by-step flow,
	 * low-level operations, and data needed to reconstruct how a specific result was produced.
	 *
	 * @param args Data to be logged.
	 */
	trace: (...args: unknown[]) => void

	/**
	 * Sets the current logger context, typically used to identify the source
	 * (e.g., module, service, or subsystem).
	 *
	 * @param context The context label to apply.
	 */
	setContext: (context: string) => void

	/**
	 * Sets the minimum log level. Messages below this level will be discarded.
	 *
	 * @param level The level to apply. Accepts a LogLevel value or its key.
	 */
	setMinLevel: (level: LogLevel | keyof typeof LogLevel | Lowercase<keyof typeof LogLevel>) => void

	/**
	 * Creates a child logger with the specified options.
	 *
	 * @param options The logger options to apply.
	 *                These options will be merged with the parent options.
	 *
	 * @throws Error if context is not set.
	 */
	child: ((options: LoggerOptions) => Logger)
		& ((context: string, options?: Omit<LoggerOptions, 'context'>) => Logger)
}
