import isNode from 'detect-node';
import { getMinLogLevelFromEnv } from './getMinLogLevelFromEnv';
import type { Logger } from './Logger';
import type { LoggerOptions } from './LoggerOptions';
import { LogLevel, resolveLogLevel } from './LogLevel';

/** @internal */
export abstract class BaseLogger implements Logger {
	protected static _lastTimestamp: number = Date.now();

	protected readonly _applicationName?: string;
	protected _context: string;
	protected _minLevel: LogLevel;
	protected readonly _pid: boolean;
	protected readonly _colors: boolean;
	protected readonly _timestamps: boolean;
	protected readonly _dateTimeFormatOptions?: Intl.DateTimeFormatOptions;
	protected readonly _prettifyObjects: boolean;
	protected readonly _timeDiff: boolean;

	constructor({
		applicationName,
		context,
		minLevel,
		pid,
		prettifyObjects = false,
		colors = true,
		timestamps = isNode,
		dateTimeFormatOptions = {
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			day: '2-digit',
			month: '2-digit',
			// @ts-ignore Not declared
			fractionalSecondDigits: 3
		},
		timeDiff = false
	}: LoggerOptions) {
		this._applicationName = applicationName;
		this._context = context;
		this._minLevel = minLevel ? resolveLogLevel(minLevel) : getMinLogLevelFromEnv(context) ?? LogLevel.SUCCESS;
		this._pid = isNode ? pid ?? true : false;
		this._colors = colors;
		this._timestamps = timestamps;
		this._dateTimeFormatOptions = dateTimeFormatOptions;
		this._prettifyObjects = prettifyObjects;
		this._timeDiff = timeDiff;
	}

	setContext(context: string): void {
		this._context = context;
	}

	setLevel(level: LogLevel | keyof typeof LogLevel | string): void {
		this._minLevel = resolveLogLevel(level);
	}

	abstract log(level: LogLevel, ...args: unknown[]): void;

	fatal(...args: unknown[]): void {
		this.log(LogLevel.FATAL, ...args);
	}

	error(...args: unknown[]): void {
		this.log(LogLevel.ERROR, ...args);
	}

	warn(...args: unknown[]): void {
		this.log(LogLevel.WARNING, ...args);
	}

	success(...args: unknown[]): void {
		this.log(LogLevel.SUCCESS, ...args);
	}

	info(...args: unknown[]): void {
		this.log(LogLevel.INFO, ...args);
	}

	debug(...args: unknown[]): void {
		this.log(LogLevel.DEBUG, ...args);
	}

	trace(...args: unknown[]): void {
		this.log(LogLevel.TRACE, ...args);
	}

	protected static _updateAndGetTimestampDiff(): string {
		const timeDiff = ` +${Date.now() - BaseLogger._lastTimestamp}ms`;
		BaseLogger._lastTimestamp = Date.now();
		return timeDiff;
	}
}
