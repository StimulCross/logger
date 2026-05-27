import type { LazyLogger } from '../interfaces/lazy-logger.js'
import type { LoggerOptions } from '../interfaces/logger-options.js'
import type { LoggerOverrideConfig } from '../interfaces/logger-override-config.js'
import type { Logger } from '../interfaces/logger.js'
import type { LazyLogFn } from '../types/lazy-log-fn.js'
import { DEFAULT_OPTIONS } from '../constants.js'
import { LogLevel } from '../enums/log-level.js'
import { LazyLoggerImpl } from '../lazy-logger.impl.js'
import { LoggerRuntime } from '../logger-runtime.js'
import { resolveLogLevel } from '../utils/resolve-log-level.js'

/** @internal */
export class CustomLoggerStrategy implements Logger {
	private _context: string
	private _minLevel: LogLevel
	private readonly _override: LoggerOverrideConfig

	private _lazy: LazyLogger | null = null

	constructor({ context, minLevel, custom }: LoggerOptions) {
		this._context = context
		this._minLevel = minLevel === undefined ? DEFAULT_OPTIONS.minLevel : resolveLogLevel(minLevel)
		this._override = typeof custom === 'function' ? { log: custom } : custom!
	}

	public get context(): string {
		return this._context
	}

	public get minLevel(): LogLevel {
		return this._minLevel
	}

	public get lazy(): LazyLogger {
		return (this._lazy ??= new LazyLoggerImpl((level, fn) => {
			if (!this._shouldLog(level))
				return

			if (this._override.lazy) {
				this._routeToCustomLazy(level, fn)

				return
			}

			try {
				const args = fn()
				this._routeToEagerFallback(level, args)
			}
			catch (err) {
				this.log(LogLevel.ERROR, '[Logger Error: Lazy evaluation failed in custom strategy]', err)
			}
		}))
	}

	public setContext(context: string): void {
		this._context = context
	}

	public setMinLevel(level: LogLevel | keyof typeof LogLevel | Lowercase<keyof typeof LogLevel>): void {
		this._minLevel = resolveLogLevel(level)
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		if (this._shouldLog(level))
			this._override.log(level, ...args)
	}

	public fatal(...args: unknown[]): void {
		if (!this._override.fatal)
			this.log(LogLevel.FATAL, ...args)
		else if (this._shouldLog(LogLevel.FATAL))
			this._override.fatal(...args)
	}

	public error(...args: unknown[]): void {
		if (!this._override.error)
			this.log(LogLevel.ERROR, ...args)
		else if (this._shouldLog(LogLevel.ERROR))
			this._override.error(...args)
	}

	public warn(...args: unknown[]): void {
		if (!this._override.warn)
			this.log(LogLevel.WARNING, ...args)
		else if (this._shouldLog(LogLevel.WARNING))
			this._override.warn(...args)
	}

	public success(...args: unknown[]): void {
		if (!this._override.success)
			this.log(LogLevel.SUCCESS, ...args)
		else if (this._shouldLog(LogLevel.SUCCESS))
			this._override.success(...args)
	}

	public info(...args: unknown[]): void {
		if (!this._override.info)
			this.log(LogLevel.INFO, ...args)
		else if (this._shouldLog(LogLevel.INFO))
			this._override.info(...args)
	}

	public debug(...args: unknown[]): void {
		if (!this._override.debug)
			this.log(LogLevel.DEBUG, ...args)
		else if (this._shouldLog(LogLevel.DEBUG))
			this._override.debug(...args)
	}

	public verbose(...args: unknown[]): void {
		if (!this._override.verbose)
			this.log(LogLevel.VERBOSE, ...args)
		else if (this._shouldLog(LogLevel.VERBOSE))
			this._override.verbose(...args)
	}

	public trace(...args: unknown[]): void {
		if (!this._override.trace)
			this.log(LogLevel.TRACE, ...args)
		else if (this._shouldLog(LogLevel.TRACE))
			this._override.trace(...args)
	}

	public child(options: LoggerOptions): Logger
	public child(context: string, options?: Omit<LoggerOptions, 'context'>): Logger
	public child(contextOrOptions?: string | LoggerOptions, options?: Omit<LoggerOptions, 'context'>): Logger {
		let resolvedContext: string | undefined
		let resolvedOptions: Omit<LoggerOptions, 'context'> | undefined

		if (typeof contextOrOptions === 'string') {
			resolvedContext = contextOrOptions
			resolvedOptions = options
		}
		else if (typeof contextOrOptions === 'object') {
			resolvedContext = contextOrOptions.context
			resolvedOptions = contextOrOptions
		}

		if (!resolvedContext)
			throw new Error('child() requires a context string or LoggerOptions with a context property')

		return new CustomLoggerStrategy({
			context: `${this._context}:${resolvedContext}`,
			minLevel: resolvedOptions?.minLevel ?? this._minLevel,
			custom: this._override,
		})
	}

	private _shouldLog(level: LogLevel): boolean {
		if (
			!LoggerRuntime.isEnabled
			|| (LoggerRuntime.globalMinLevel !== null && LoggerRuntime.globalMinLevel < level)
		) {
			return false
		}

		return this._minLevel >= level
	}

	private _routeToEagerFallback(level: LogLevel, args: unknown[]): void {
		switch (level) {
			case LogLevel.FATAL:
				return this.fatal(...args)

			case LogLevel.ERROR:
				return this.error(...args)

			case LogLevel.WARNING:
				return this.warn(...args)

			case LogLevel.SUCCESS:
				return this.success(...args)

			case LogLevel.INFO:
				return this.info(...args)

			case LogLevel.DEBUG:
				return this.debug(...args)

			case LogLevel.VERBOSE:
				return this.verbose(...args)

			case LogLevel.TRACE:
				return this.trace(...args)

			default:
				throw new Error(`Invalid log level: ${String(level)}`)
		}
	}

	private _routeToCustomLazy(level: LogLevel, fn: LazyLogFn): void {
		const lazyOverride = this._override.lazy!

		switch (level) {
			case LogLevel.FATAL:
				return lazyOverride.fatal ? lazyOverride.fatal(fn) : lazyOverride.log(level, fn)

			case LogLevel.ERROR:
				return lazyOverride.error ? lazyOverride.error(fn) : lazyOverride.log(level, fn)

			case LogLevel.WARNING:
				return lazyOverride.warn ? lazyOverride.warn(fn) : lazyOverride.log(level, fn)

			case LogLevel.SUCCESS:
				return lazyOverride.success ? lazyOverride.success(fn) : lazyOverride.log(level, fn)

			case LogLevel.INFO:
				return lazyOverride.info ? lazyOverride.info(fn) : lazyOverride.log(level, fn)

			case LogLevel.DEBUG:
				return lazyOverride.debug ? lazyOverride.debug(fn) : lazyOverride.log(level, fn)

			case LogLevel.VERBOSE:
				return lazyOverride.verbose ? lazyOverride.verbose(fn) : lazyOverride.log(level, fn)

			case LogLevel.TRACE:
				return lazyOverride.trace ? lazyOverride.trace(fn) : lazyOverride.log(level, fn)

			default:
				throw new Error(`Invalid log level: ${String(level)}`)
		}
	}
}
