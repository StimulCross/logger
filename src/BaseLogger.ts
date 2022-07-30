import * as isNode from 'detect-node';
import * as chalk from 'chalk';
import { getMinLogLevelFromEnv } from './getMinLogLevelFromEnv';
import type { Logger } from './Logger';
import type { LoggerOptions } from './LoggerOptions';
import { LogLevel, resolveLogLevel } from './LogLevel';

export const TYPES = {
	[LogLevel.FATAL]: ' FATAL ',
	[LogLevel.ERROR]: 'ERROR  ',
	[LogLevel.WARNING]: 'WARNING',
	[LogLevel.SUCCESS]: 'SUCCESS',
	[LogLevel.INFO]: 'INFO   ',
	[LogLevel.DEBUG]: 'DEBUG  ',
	[LogLevel.TRACE]: 'TRACE  '
};

export const COLORED_TYPES = {
	[LogLevel.FATAL]: chalk.bgRedBright.whiteBright.bold(TYPES[LogLevel.FATAL]),
	[LogLevel.ERROR]: chalk.red(TYPES[LogLevel.ERROR]),
	[LogLevel.WARNING]: chalk.bold.yellowBright(TYPES[LogLevel.WARNING]),
	[LogLevel.SUCCESS]: chalk.bold.greenBright(TYPES[LogLevel.SUCCESS]),
	[LogLevel.INFO]: chalk.bold.blueBright(TYPES[LogLevel.INFO]),
	[LogLevel.DEBUG]: chalk.bold.magentaBright(TYPES[LogLevel.DEBUG]),
	[LogLevel.TRACE]: chalk.bold.cyanBright(TYPES[LogLevel.TRACE])
};

export const COLORS = {
	ACCENT: (str: string): string => chalk.yellowBright(str),
	WHITE: (str: string): string => chalk.white(str),
	[LogLevel.FATAL]: (str: string): string => chalk.redBright(str),
	[LogLevel.ERROR]: (str: string): string => chalk.redBright(str),
	[LogLevel.WARNING]: (str: string): string => chalk.yellowBright(str),
	[LogLevel.SUCCESS]: (str: string): string => chalk.greenBright(str),
	[LogLevel.INFO]: (str: string): string => chalk.blueBright(str),
	[LogLevel.DEBUG]: (str: string): string => chalk.magentaBright(str),
	[LogLevel.TRACE]: (str: string): string => chalk.cyanBright(str)
};

export abstract class BaseLogger implements Logger {
	protected static _lastTimestamp: number = Date.now();

	protected readonly _applicationName?: string;
	protected readonly _context: string;
	protected readonly _minLevel: LogLevel;
	protected readonly _pid: boolean;
	protected readonly _colors: boolean;
	protected readonly _timestamps: boolean;
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
		timeDiff = false
	}: LoggerOptions) {
		this._applicationName = applicationName;
		this._context = context;
		this._minLevel = minLevel ? resolveLogLevel(minLevel) : getMinLogLevelFromEnv(context) ?? LogLevel.SUCCESS;
		this._pid = isNode ? pid ?? true : false;
		this._colors = colors;
		this._timestamps = timestamps;
		this._prettifyObjects = prettifyObjects;
		this._timeDiff = timeDiff;
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

	protected static _wrapWithColor(type: keyof typeof COLORS, str: string): string {
		return COLORS[type](str);
	}

	protected static _updateAndGetTimestampDiff(): string {
		const result = BaseLogger._wrapWithColor('ACCENT', ` +${Date.now() - BaseLogger._lastTimestamp}ms`);
		BaseLogger._lastTimestamp = Date.now();
		return result;
	}
}
