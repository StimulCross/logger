import { getMinLogLevelFromEnv } from './getMinLogLevelFromEnv';
import type { Logger } from './Logger';
import type { LoggerOptions } from './LoggerOptions';
import { LogLevel, resolveLogLevel } from './LogLevel';

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
	 * Handles trace-level messages.
	 *
	 * @remarks
	 * If omitted, the logger will route trace messages through `log`.
	 */
	trace?: (...args: unknown[]) => void;
}

/**
 * Custom logger override.
 *
 * @remarks
 * Allows replacing the logger’s behavior either with:
 * - a full custom logger implementation (`LoggerOverrideConfig`), or
 * - a single function that handles all log levels.
 *
 * When a function is provided, it receives the log level and all message arguments
 * and is responsible for handling every log call.
 */
export type LoggerOverride = LoggerOverrideConfig | ((level: LogLevel, ...args: unknown[]) => void);

/** @internal */
export class CustomLoggerWrapper implements Logger {
	private _context: string;
	private _minLevel: LogLevel;
	private readonly _override: LoggerOverrideConfig;

	constructor({ context, minLevel, custom }: LoggerOptions) {
		this._context = context;
		this._minLevel = minLevel
			? resolveLogLevel(minLevel)
			: (getMinLogLevelFromEnv(this._context) ?? LogLevel.SUCCESS);
		this._override = typeof custom === 'function' ? { log: custom } : custom!;
	}

	setContext(context: string): void {
		this._context = context;
	}

	setMinLevel(level: LogLevel | keyof typeof LogLevel | string): void {
		this._minLevel = resolveLogLevel(level);
	}

	log(level: LogLevel, ...args: unknown[]): void {
		if (this._shouldLog(level)) {
			this._override.log(level, ...args);
		}
	}

	fatal(...args: unknown[]): void {
		if (!this._override.fatal) {
			this.log(LogLevel.FATAL, ...args);
		} else if (this._shouldLog(LogLevel.FATAL)) {
			this._override.fatal(...args);
		}
	}

	error(...args: unknown[]): void {
		if (!this._override.error) {
			this.log(LogLevel.ERROR, ...args);
		} else if (this._shouldLog(LogLevel.ERROR)) {
			this._override.error(...args);
		}
	}

	warn(...args: unknown[]): void {
		if (!this._override.warn) {
			this.log(LogLevel.WARNING, ...args);
		} else if (this._shouldLog(LogLevel.WARNING)) {
			this._override.warn(...args);
		}
	}

	success(...args: unknown[]): void {
		if (!this._override.warn) {
			this.log(LogLevel.SUCCESS, ...args);
		} else if (this._shouldLog(LogLevel.SUCCESS)) {
			this._override.warn(...args);
		}
	}

	info(...args: unknown[]): void {
		if (!this._override.info) {
			this.log(LogLevel.INFO, ...args);
		} else if (this._shouldLog(LogLevel.INFO)) {
			this._override.info(...args);
		}
	}

	debug(...args: unknown[]): void {
		if (!this._override.debug) {
			this.log(LogLevel.DEBUG, ...args);
		} else if (this._shouldLog(LogLevel.DEBUG)) {
			this._override.debug(...args);
		}
	}

	trace(...args: unknown[]): void {
		if (!this._override.trace) {
			this.log(LogLevel.TRACE, ...args);
		} else if (this._shouldLog(LogLevel.TRACE)) {
			this._override.trace(...args);
		}
	}

	private _shouldLog(level: LogLevel): boolean {
		return this._minLevel >= level;
	}
}
