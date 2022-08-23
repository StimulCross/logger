import type { LogLevel } from './LogLevel';

/**
 * Cross environment logger.
 */
export interface Logger {
	/**
	 * Prints a message to the console.
	 *
	 * @param level The level of the log. If the specified level is less than the minimum log level of the logger,
	 * the log will be ignored.
	 * @param args Any data to print.
	 */
	log: (level: LogLevel, ...args: unknown[]) => void;

	/**
	 * Prints fatal message to the console.
	 *
	 * @param args Any data to print.
	 */
	fatal: (...args: unknown[]) => void;

	/**
	 * Prints error message to the console.
	 *
	 * @param args Any data to print.
	 */
	error: (...args: unknown[]) => void;

	/**
	 * Prints warning message to the console.
	 *
	 * @param args Any data to print.
	 */
	warn: (...args: unknown[]) => void;

	/**
	 * Prints success message to the console.
	 *
	 * @param args Any data to print.
	 */
	success: (...args: unknown[]) => void;

	/**
	 * Prints info message to the console.
	 *
	 * @param args Any data to print.
	 */
	info: (...args: unknown[]) => void;

	/**
	 * Prints debug message to the console.
	 *
	 * @param args Any data to print.
	 */
	debug: (...args: unknown[]) => void;

	/**
	 * Prints trace message to the console.
	 *
	 * @param args Any data to print.
	 */
	trace: (...args: unknown[]) => void;
}
