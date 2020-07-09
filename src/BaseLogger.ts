import { LoggerOptions } from './LoggerOptions';
import { LogLevel, resolveLogLevel } from './LogLevel';
import { Logger } from './Logger';
import * as isNode from 'detect-node';

export abstract class BaseLogger implements Logger {
	protected readonly _name: string;
	protected readonly _minLevel: LogLevel;
	protected readonly _emoji: boolean;
	protected readonly _colors: boolean;
	protected readonly _timestamps: boolean;

	constructor({
		name,
		minLevel = LogLevel.WARNING,
		emoji = false,
		colors = true,
		timestamps = isNode
	}: LoggerOptions) {
		this._name = name;
		this._minLevel = resolveLogLevel(minLevel);
		this._emoji = emoji;
		this._colors = colors;
		this._timestamps = timestamps;
	}

	abstract log(level: LogLevel, message: string): void;

	// region convenience methods
	crit(message: string) {
		this.log(LogLevel.CRITICAL, message);
	}

	critical(message: string) {
		this.log(LogLevel.CRITICAL, message);
	}

	err(message: string) {
		this.log(LogLevel.ERROR, message);
	}

	error(message: string) {
		this.log(LogLevel.ERROR, message);
	}

	warn(message: string) {
		this.log(LogLevel.WARNING, message);
	}

	warning(message: string) {
		this.log(LogLevel.WARNING, message);
	}

	info(message: string) {
		this.log(LogLevel.INFO, message);
	}

	debug(message: string) {
		this.log(LogLevel.DEBUG, message);
	}

	/** @deprecated use debug instead */
	debug1(message: string) {
		this.log(LogLevel.DEBUG, message);
	}

	/** @deprecated use debug instead */
	debug2(message: string) {
		this.log(LogLevel.DEBUG, message);
	}

	/** @deprecated use debug instead */
	debug3(message: string) {
		this.log(LogLevel.DEBUG, message);
	}

	trace(message: string) {
		this.log(LogLevel.TRACE, message);
	}
	// endregion
}
