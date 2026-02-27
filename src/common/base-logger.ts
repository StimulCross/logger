import { DEFAULT_OPTIONS } from './constants.js';
import { LogLevel } from './enums/log-level.js';
import { type LogFormatter } from './formatters/log-formatter.js';
import { type LogEntry } from './interfaces/log-entry.js';
import { type LoggerOptions } from './interfaces/logger-options.js';
import { type Logger } from './interfaces/logger.js';
import { LoggerObserver } from './logger-observer.js';
import { LoggerRuntime } from './logger-runtime.js';
import { LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP } from './utils/log-level-map.js';
import { resolveLogLevel } from './utils/resolve-log-level.js';

/** @internal */
export abstract class BaseLogger implements Logger {
	protected static _lastGlobalTimestamp: number = Date.now();
	protected _lastLocalTimestamp: number = Date.now();

	protected readonly _options: LoggerOptions;

	protected abstract _formatter: LogFormatter;
	protected abstract _minLevel: LogLevel;

	constructor(options: LoggerOptions) {
		this._options = { ...DEFAULT_OPTIONS, ...options };
	}

	public get context(): string {
		return this._options.context;
	}

	public get minLevel(): LogLevel {
		return this._minLevel;
	}

	public setContext(context: string): void {
		this._options.context = context;
	}

	public setMinLevel(level: LogLevel | keyof typeof LogLevel | Lowercase<keyof typeof LogLevel>): void {
		this._minLevel = resolveLogLevel(level);
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		if (!this._shouldLog(level)) {
			return;
		}

		const entry = this._createLogEntry(level, args);

		LoggerObserver.notify(entry);

		const parts = this._formatter.formatToParts(entry);

		const log = LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[level];
		log(...parts);
	}

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

		return this._createChildLogger(
			this._mergeLoggerOptions(this._options, {
				...resolvedOptions,
				context: `${this._options.context}:${resolvedContext}`,
			}),
		);
	}

	protected abstract _createLogEntry(level: LogLevel, args: unknown[]): LogEntry;

	protected abstract _createChildLogger(options: LoggerOptions): Logger;

	protected _shouldLog(level: LogLevel): boolean {
		if (
			!LoggerRuntime.isEnabled ||
			(LoggerRuntime.globalMinLevel !== null && LoggerRuntime.globalMinLevel < level)
		) {
			return false;
		}

		return this._minLevel >= level;
	}

	protected _getTimeDiff(): number {
		const now = Date.now();

		const isLocal = this._options.timeDiff === 'local';
		const timeDiff = isLocal ? now - this._lastLocalTimestamp : now - BaseLogger._lastGlobalTimestamp;

		this._lastLocalTimestamp = now;
		BaseLogger._lastGlobalTimestamp = now;

		return timeDiff;
	}

	private _mergeLoggerOptions(parent: LoggerOptions, child?: LoggerOptions): LoggerOptions {
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
