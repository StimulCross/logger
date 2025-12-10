import { type LogLevel } from '../enums/log-level.js';

/**
 * Cross-environment logger interface.
 *
 * Provides a unified API for structured logging across different runtimes (Node.js, browsers, etc.).
 * All log methods respect the currently configured minimum log level.
 */
export interface Logger {
	/**
	 * Emits a log message.
	 *
	 * @param level The severity of the message. Messages below the current minimum log level are ignored.
	 * @param args Data to be logged.
	 */
	log(level: LogLevel, ...args: unknown[]): void;

	/**
	 * Logs a fatal error and indicates that the application cannot continue.
	 *
	 * @param args Data to be logged.
	 */
	fatal(...args: unknown[]): void;

	/**
	 * Logs an error indicating that an operation has failed.
	 *
	 * @param args Data to be logged.
	 */
	error(...args: unknown[]): void;

	/**
	 * Logs a warning about a potentially problematic situation.
	 *
	 * @param args Data to be logged.
	 */
	warn(...args: unknown[]): void;

	/**
	 * Logs a message indicating successful completion of an operation.
	 *
	 * @param args Data to be logged.
	 */
	success(...args: unknown[]): void;

	/**
	 * Logs general informational messages.
	 *
	 * @param args Data to be logged.
	 */
	info(...args: unknown[]): void;

	/**
	 * Logs debug-level messages intended for development and troubleshooting.
	 *
	 * @param args Data to be logged.
	 */
	debug(...args: unknown[]): void;

	/**
	 * Logs highly verbose diagnostic information.
	 *
	 * @param args Data to be logged.
	 */
	trace(...args: unknown[]): void;

	/**
	 * Sets the current logger context, typically used to identify the source
	 * (e.g., module, service, or subsystem).
	 *
	 * @param context The context label to apply.
	 */
	setContext(context: string): void;

	/**
	 * Sets the minimum log level. Messages below this level will be discarded.
	 *
	 * @param level The level to apply. Accepts a LogLevel value or its key.
	 */
	setMinLevel(level: LogLevel | keyof typeof LogLevel): void;
}
