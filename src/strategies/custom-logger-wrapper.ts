import { LogLevel } from '../enums/log-level';
import { type Logger } from '../interfaces/logger';
import { type LoggerOptions } from '../interfaces/logger-options';
import { type LoggerOverrideConfig } from '../interfaces/logger-override-config';
import { getMinLogLevelFromEnv } from '../utils/get-min-log-level-from-env';
import { resolveLogLevel } from '../utils/resolve-log-level';

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

	public setContext(context: string): void {
		this._context = context;
	}

	public setMinLevel(level: LogLevel | keyof typeof LogLevel): void {
		this._minLevel = resolveLogLevel(level);
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		if (this._shouldLog(level)) {
			this._override.log(level, ...args);
		}
	}

	public fatal(...args: unknown[]): void {
		if (!this._override.fatal) {
			this.log(LogLevel.FATAL, ...args);
		} else if (this._shouldLog(LogLevel.FATAL)) {
			this._override.fatal(...args);
		}
	}

	public error(...args: unknown[]): void {
		if (!this._override.error) {
			this.log(LogLevel.ERROR, ...args);
		} else if (this._shouldLog(LogLevel.ERROR)) {
			this._override.error(...args);
		}
	}

	public warn(...args: unknown[]): void {
		if (!this._override.warn) {
			this.log(LogLevel.WARNING, ...args);
		} else if (this._shouldLog(LogLevel.WARNING)) {
			this._override.warn(...args);
		}
	}

	public success(...args: unknown[]): void {
		if (!this._override.warn) {
			this.log(LogLevel.SUCCESS, ...args);
		} else if (this._shouldLog(LogLevel.SUCCESS)) {
			this._override.warn(...args);
		}
	}

	public info(...args: unknown[]): void {
		if (!this._override.info) {
			this.log(LogLevel.INFO, ...args);
		} else if (this._shouldLog(LogLevel.INFO)) {
			this._override.info(...args);
		}
	}

	public debug(...args: unknown[]): void {
		if (!this._override.debug) {
			this.log(LogLevel.DEBUG, ...args);
		} else if (this._shouldLog(LogLevel.DEBUG)) {
			this._override.debug(...args);
		}
	}

	public trace(...args: unknown[]): void {
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
