import { DEFAULT_OPTIONS } from '../constants.js';
import { LogLevel } from '../enums/log-level.js';
import { type LoggerOptions } from '../interfaces/logger-options.js';
import { type LoggerOverrideConfig } from '../interfaces/logger-override-config.js';
import { type Logger } from '../interfaces/logger.js';
import { LoggerRuntime } from '../logger-runtime.js';
import { resolveLogLevel } from '../utils/resolve-log-level.js';

/** @internal */
export class CustomLoggerStrategy implements Logger {
	private _context: string;
	private _minLevel: LogLevel;
	private readonly _override: LoggerOverrideConfig;

	constructor({ context, minLevel, custom }: LoggerOptions) {
		this._context = context;
		this._minLevel = minLevel === undefined ? DEFAULT_OPTIONS.minLevel : resolveLogLevel(minLevel);
		this._override = typeof custom === 'function' ? { log: custom } : custom!;
	}

	public get context(): string {
		return this._context;
	}

	public get minLevel(): LogLevel {
		return this._minLevel;
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
		if (!this._override.success) {
			this.log(LogLevel.SUCCESS, ...args);
		} else if (this._shouldLog(LogLevel.SUCCESS)) {
			this._override.success(...args);
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

	public child(options: LoggerOptions): Logger;
	public child(context: string, options?: Omit<LoggerOptions, 'context'>): Logger;
	public child(contextOrOptions?: string | LoggerOptions, options?: Omit<LoggerOptions, 'context'>): Logger {
		let resolvedContext: string | undefined;
		let resolvedOptions: Omit<LoggerOptions, 'context'> | undefined;

		if (typeof contextOrOptions === 'string') {
			resolvedContext = contextOrOptions;
			resolvedOptions = options;
		} else if (typeof contextOrOptions === 'object') {
			resolvedContext = contextOrOptions.context;
			resolvedOptions = contextOrOptions;
		}

		if (!resolvedContext) {
			throw new Error('child() requires a context string or LoggerOptions with a context property');
		}

		return new CustomLoggerStrategy({
			context: `${this._context}:${resolvedContext}`,
			minLevel: resolvedOptions?.minLevel ?? this._minLevel,
			custom: this._override,
		});
	}

	private _shouldLog(level: LogLevel): boolean {
		if (
			!LoggerRuntime.isEnabled ||
			(LoggerRuntime.globalMinLevel !== null && LoggerRuntime.globalMinLevel < level)
		) {
			return false;
		}

		return this._minLevel >= level;
	}
}
