import { DEFAULT_OPTIONS } from '../constants.js';
import { LogLevel } from '../enums/log-level.js';
import { type DateTimeFormatOptions, type LoggerOptions } from '../interfaces/logger-options.js';
import { type Logger } from '../interfaces/logger.js';
import { type DateTimeFormatter } from '../types/datetime-formatter.js';
import { type LoggerTimeDiffScope } from '../types/logger-time-diff-scope.js';
import { resolveLogLevel } from '../utils/resolve-log-level.js';

/** @internal */
export abstract class BaseLogger implements Logger {
	protected static _lastGlobalTimestamp: number = Date.now();
	protected _lastLocalTimestamp: number = Date.now();

	protected readonly _applicationName?: string;
	protected _context: string;
	protected _colors: boolean;
	protected readonly _timestamps: boolean;
	protected readonly _dateTimeFormatter?: DateTimeFormatter;
	protected readonly _dateTimeFormatOptions?: DateTimeFormatOptions;
	protected readonly _timeDiff?: LoggerTimeDiffScope;

	protected abstract _minLevel: LogLevel;

	constructor({
		applicationName,
		context,
		colors = DEFAULT_OPTIONS.colors,
		timestamps = DEFAULT_OPTIONS.timestamps,
		dateTimeFormat,
		timeDiff,
	}: LoggerOptions) {
		this._applicationName = applicationName;
		this._context = context;
		this._colors = colors;
		this._timestamps = timestamps;
		this._timeDiff = timeDiff;

		if (typeof dateTimeFormat === 'function') {
			this._dateTimeFormatter = dateTimeFormat;
			this._dateTimeFormatOptions = DEFAULT_OPTIONS.dateTimeFormat;
		} else if (typeof dateTimeFormat === 'object') {
			this._dateTimeFormatOptions = { ...DEFAULT_OPTIONS.dateTimeFormat, ...dateTimeFormat };
		}
	}

	public setContext(context: string): void {
		this._context = context;
	}

	public setMinLevel(level: LogLevel | keyof typeof LogLevel | Lowercase<keyof typeof LogLevel>): void {
		this._minLevel = resolveLogLevel(level);
	}

	public abstract log(level: LogLevel, ...args: unknown[]): void;

	public fatal(...args: unknown[]): void {
		this.log(LogLevel.FATAL, ...args);
	}

	public error(...args: unknown[]): void {
		this.log(LogLevel.ERROR, ...args);
	}

	public warn(...args: unknown[]): void {
		this.log(LogLevel.WARNING, ...args);
	}

	public success(...args: unknown[]): void {
		this.log(LogLevel.SUCCESS, ...args);
	}

	public info(...args: unknown[]): void {
		this.log(LogLevel.INFO, ...args);
	}

	public debug(...args: unknown[]): void {
		this.log(LogLevel.DEBUG, ...args);
	}

	public trace(...args: unknown[]): void {
		this.log(LogLevel.TRACE, ...args);
	}

	protected _shouldLog(level: LogLevel): boolean {
		return this._minLevel >= level;
	}

	protected _getTimeDiff(): string {
		const now = Date.now();

		if (!this._timeDiff) {
			BaseLogger._lastGlobalTimestamp = now;
			return '';
		}

		const timeDiff =
			this._timeDiff === 'global' ? now - BaseLogger._lastGlobalTimestamp : now - this._lastLocalTimestamp;

		this._lastLocalTimestamp = now;
		BaseLogger._lastGlobalTimestamp = now;

		return `+${timeDiff}ms ${this._timeDiff === 'global' ? '[G]' : '[L]'}`;
	}
}
