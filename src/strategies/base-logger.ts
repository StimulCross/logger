import { DEFAULT_OPTIONS } from '../constants.js';
import { createLogger } from '../create-logger.js';
import { LogLevel } from '../enums/log-level.js';
import { type DateTimeFormatOptions, type LoggerOptions } from '../interfaces/logger-options.js';
import { type Logger } from '../interfaces/logger.js';
import { type DateTimeFormatter } from '../types/datetime-formatter.js';
import { resolveLogLevel } from '../utils/resolve-log-level.js';

/** @internal */
export abstract class BaseLogger implements Logger {
	protected static _lastGlobalTimestamp: number = Date.now();
	protected _lastLocalTimestamp: number = Date.now();

	protected readonly _options: LoggerOptions;

	protected readonly _dateTimeFormatter?: DateTimeFormatter;
	protected readonly _dateTimeFormatOptions?: DateTimeFormatOptions;

	protected abstract _minLevel: LogLevel;

	constructor(options: LoggerOptions) {
		this._options = { ...DEFAULT_OPTIONS, ...options };

		const { dateTimeFormat } = this._options;

		if (typeof dateTimeFormat === 'function') {
			this._dateTimeFormatter = dateTimeFormat;
			this._dateTimeFormatOptions = DEFAULT_OPTIONS.dateTimeFormat;
		} else if (typeof dateTimeFormat === 'object') {
			this._dateTimeFormatOptions = {
				...DEFAULT_OPTIONS.dateTimeFormat,
				...dateTimeFormat,
			};
		}
	}

	public setContext(context: string): void {
		this._options.context = context;
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

		return createLogger(
			`${this._options.context}:${resolvedContext}`,
			this._mergeLoggerOptions(this._options, resolvedOptions),
		);
	}

	protected _shouldLog(level: LogLevel): boolean {
		return this._minLevel >= level;
	}

	protected _getTimeDiff(): string {
		const now = Date.now();

		if (!this._options.timeDiff) {
			BaseLogger._lastGlobalTimestamp = now;
			return '';
		}

		const isGlobal = this._options.timeDiff === 'global';
		const timeDiff = isGlobal ? now - BaseLogger._lastGlobalTimestamp : now - this._lastLocalTimestamp;

		this._lastLocalTimestamp = now;
		BaseLogger._lastGlobalTimestamp = now;

		return `+${timeDiff}ms ${isGlobal ? '[G]' : '[L]'}`;
	}

	private _mergeLoggerOptions(parent: LoggerOptions, child?: Omit<LoggerOptions, 'context'>): LoggerOptions {
		const result: LoggerOptions = {
			...parent,
			...child,
		};

		if (parent.inspectOptions || child?.inspectOptions) {
			result.inspectOptions = {
				...parent.inspectOptions,
				...child?.inspectOptions,
			};
		}

		const parentDateTimeFormat = parent.dateTimeFormat;
		const childDatetimeFormat = child?.dateTimeFormat;

		if (typeof childDatetimeFormat === 'function') {
			result.dateTimeFormat = childDatetimeFormat;
		} else if (typeof childDatetimeFormat === 'object') {
			result.dateTimeFormat = {
				...(typeof parentDateTimeFormat === 'object' ? parentDateTimeFormat : {}),
				...childDatetimeFormat,
			};
		} else {
			result.dateTimeFormat = parentDateTimeFormat;
		}

		return result;
	}
}
