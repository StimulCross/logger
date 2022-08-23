import { getMinLogLevelFromEnv } from './getMinLogLevelFromEnv';
import type { Logger } from './Logger';
import type { LoggerOptions } from './LoggerOptions';
import { LogLevel, resolveLogLevel } from './LogLevel';

/**
 * Custom logger config.
 */
export interface LoggerOverrideConfig {
	log: (level: LogLevel, ...args: unknown[]) => void;
	fatal?: (...args: unknown[]) => void;
	error?: (...args: unknown[]) => void;
	warn?: (...args: unknown[]) => void;
	success?: (...args: unknown[]) => void;
	info?: (...args: unknown[]) => void;
	debug?: (...args: unknown[]) => void;
	trace?: (...args: unknown[]) => void;
}

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
			: getMinLogLevelFromEnv(this._context) ?? LogLevel.SUCCESS;
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
