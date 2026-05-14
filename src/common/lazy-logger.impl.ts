import { LogLevel } from './enums/log-level.js';
import { type LazyLogger } from './interfaces/lazy-logger.js';
import { type LazyLogFn } from './types/lazy-log-fn.js';

/** @internal */
export class LazyLoggerImpl implements LazyLogger {
	/** @internal */
	constructor(private readonly _executeLazy: (level: LogLevel, fn: LazyLogFn) => void) {}

	public log(level: LogLevel, fn: LazyLogFn): void {
		this._executeLazy(level, fn);
	}

	public fatal(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.FATAL, fn);
	}

	public error(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.ERROR, fn);
	}

	public warn(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.WARNING, fn);
	}

	public success(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.SUCCESS, fn);
	}

	public info(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.INFO, fn);
	}

	public debug(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.DEBUG, fn);
	}

	public verbose(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.VERBOSE, fn);
	}

	public trace(fn: LazyLogFn): void {
		this._executeLazy(LogLevel.TRACE, fn);
	}
}
