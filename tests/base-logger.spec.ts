import type { LogEntry } from '../src/common/interfaces/log-entry.js'
import type { LoggerOptions } from '../src/common/interfaces/logger-options.js'
import type { Logger } from '../src/common/interfaces/logger.js'
import { process } from 'std-env'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BaseLogger } from '../src/common/base-logger.js'
import { LogLevel } from '../src/common/enums/log-level.js'
import { LogFormatter } from '../src/common/formatters/log-formatter.js'
import { LoggerObserver } from '../src/common/logger-observer.js'
import { LoggerRuntime } from '../src/common/logger-runtime.js'
import { LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP } from '../src/common/utils/log-level-map.js'

class TestFormatter extends LogFormatter {
	public formatToParts(entry: LogEntry): unknown[] {
		return ['formatted', entry.level, ...entry.args]
	}
}

class TestLogger extends BaseLogger {
	protected override readonly _formatter = new TestFormatter(this._options)
	protected override _minLevel: LogLevel = LogLevel.TRACE

	public static _setGlobalTs(v: number): void {
		BaseLogger._lastGlobalTimestamp = v
	}

	public get options(): LoggerOptions {
		return this._options
	}

	public _callShouldLog(level: LogLevel): boolean {
		return this._shouldLog(level)
	}

	public _callGetTimeDiff(): number | null {
		return this._getTimeDiff()
	}

	public _setLocalTs(v: number): void {
		this._lastLocalTimestamp = v
	}

	protected override _createChildLogger(options: LoggerOptions): Logger {
		return new TestLogger(options)
	}

	protected override _createLogEntry(level: LogLevel, args: unknown[]): LogEntry {
		return {
			level,
			context: this._options.context,
			timestamp: Date.now(),
			args,
			appName: this._options.applicationName,
			pid: process.pid,
			timeDiff: this._getTimeDiff(),
			timeDiffScope: this._options.timeDiff ?? 'global',
		}
	}
}

function createTestLogger(opts: Partial<LoggerOptions> = {}): TestLogger {
	return new TestLogger({
		context: 'CTX',
		...opts,
	})
}

describe('baseLogger', () => {
	const runtimeSnapshot = () => ({
		isEnabled: LoggerRuntime.isEnabled,
		globalMinLevel: LoggerRuntime.globalMinLevel,
	})

	let initialRuntime: ReturnType<typeof runtimeSnapshot>

	beforeEach(() => {
		vi.restoreAllMocks()

		initialRuntime = runtimeSnapshot()
		LoggerRuntime.setEnabled(true)
		LoggerRuntime.setGlobalMinLevel(null)
	})

	afterEach(() => {
		LoggerRuntime.setEnabled(initialRuntime.isEnabled)
		LoggerRuntime.setGlobalMinLevel(initialRuntime.globalMinLevel)

		vi.restoreAllMocks()
	})

	describe('constructor', () => {
		it('stores options and keeps default dateTimeFormat options when not provided', () => {
			const logger = createTestLogger({
				applicationName: 'APP',
				colors: false,
				timestamps: false,
				timeDiff: undefined,
			})

			expect(logger.context).toBe('CTX')
			expect(logger.options.applicationName).toBe('APP')
			expect(logger.options.colors).toBe(false)
			expect(logger.options.timestamps).toBe(false)
			expect(logger.options.timeDiff).toBeUndefined()
		})

		it('accepts dateTimeFormat function (stored in options)', () => {
			const fmt = vi.fn((d: Date) => d.toISOString())
			const logger = createTestLogger({ dateTimeFormat: fmt })

			expect(logger.options.dateTimeFormat).toBe(fmt)
		})

		it('accepts dateTimeFormat options object', () => {
			const logger = createTestLogger({ dateTimeFormat: { locale: 'ru-RU', hour12: false } })

			expect(logger.options.dateTimeFormat).toEqual({ locale: 'ru-RU', hour12: false })
		})
	})

	describe('configuration methods', () => {
		it('setContext updates context in options', () => {
			const logger = createTestLogger({ context: 'A' })
			expect(logger.context).toBe('A')

			logger.setContext('B')
			expect(logger.context).toBe('B')
			expect(logger.options.context).toBe('B')
		})

		it('setMinLevel resolves numeric / string / lowercase string levels', () => {
			const logger = createTestLogger()

			logger.setMinLevel(LogLevel.ERROR)
			expect(logger.minLevel).toBe(LogLevel.ERROR)

			logger.setMinLevel('VERBOSE')
			expect(logger.minLevel).toBe(LogLevel.VERBOSE)

			logger.setMinLevel('warning')
			expect(logger.minLevel).toBe(LogLevel.WARNING)
		})
	})

	describe('state', () => {
		it('should return correct context', () => {
			const logger = createTestLogger({ context: 'TEST' })

			expect(logger.context).toBe('TEST')

			logger.setContext('TEST2')
			expect(logger.context).toBe('TEST2')
		})

		it('should return correct minLevel', () => {
			const logger = createTestLogger()

			logger.setMinLevel(LogLevel.INFO)
			expect(logger.minLevel).toBe(LogLevel.INFO)

			logger.setMinLevel(LogLevel.ERROR)
			expect(logger.minLevel).toBe(LogLevel.ERROR)

			logger.setMinLevel(LogLevel.TRACE)
			expect(logger.minLevel).toBe(LogLevel.TRACE)
		})
	})

	describe('_shouldLog', () => {
		it('returns true only when minLevel >= level', () => {
			const logger = createTestLogger()
			logger.setMinLevel(LogLevel.INFO)

			expect(logger._callShouldLog(LogLevel.VERBOSE)).toBe(false)
			expect(logger._callShouldLog(LogLevel.DEBUG)).toBe(false)
			expect(logger._callShouldLog(LogLevel.INFO)).toBe(true)
			expect(logger._callShouldLog(LogLevel.SUCCESS)).toBe(true)
		})

		it('returns false when LoggerRuntime is disabled (even if local minLevel allows)', () => {
			const logger = createTestLogger()
			logger.setMinLevel(LogLevel.TRACE)

			LoggerRuntime.setEnabled(false)

			expect(logger._callShouldLog(LogLevel.FATAL)).toBe(false)
			expect(logger._callShouldLog(LogLevel.TRACE)).toBe(false)
		})

		it('respects LoggerRuntime.globalMinLevel as a global lower bound', () => {
			const logger = createTestLogger()
			logger.setMinLevel(LogLevel.TRACE)

			LoggerRuntime.setGlobalMinLevel(LogLevel.WARNING)

			expect(logger._callShouldLog(LogLevel.VERBOSE)).toBe(false)
			expect(logger._callShouldLog(LogLevel.DEBUG)).toBe(false)
			expect(logger._callShouldLog(LogLevel.INFO)).toBe(false)
			expect(logger._callShouldLog(LogLevel.WARNING)).toBe(true)
			expect(logger._callShouldLog(LogLevel.ERROR)).toBe(true)
		})
	})

	describe('log', () => {
		it('does nothing when _shouldLog returns false', () => {
			const logger = createTestLogger()
			logger.setMinLevel(LogLevel.ERROR)

			const shouldLogSpy = vi.spyOn<any, any>(logger as any, '_shouldLog')
			const notifySpy = vi.spyOn(LoggerObserver, 'notify')
			const formatterSpy = vi.spyOn((logger as any)._formatter as TestFormatter, 'formatToParts')
			const consoleSpy = vi.spyOn(console, 'log')

			logger.log(LogLevel.TRACE, 'ignored')

			expect(shouldLogSpy).toHaveBeenCalledWith(LogLevel.TRACE)
			expect(notifySpy).not.toHaveBeenCalled()
			expect(formatterSpy).not.toHaveBeenCalled()
			expect(consoleSpy).not.toHaveBeenCalled()
		})

		it('creates entry, notifies observer, formats and writes to console when allowed', () => {
			const logger = createTestLogger()
			logger.setMinLevel(LogLevel.TRACE)

			const notifySpy = vi.spyOn(LoggerObserver, 'notify')
			const formatter = (logger as any)._formatter as TestFormatter
			const formatterSpy = vi.spyOn(formatter, 'formatToParts')

			const infoSpy = vi.fn()
			LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.INFO] = infoSpy

			logger.log(LogLevel.INFO, 'msg1', { foo: 'bar' })

			expect(notifySpy).toHaveBeenCalledTimes(1)
			const [entryArg] = notifySpy.mock.calls[0]
			expect(entryArg.level).toBe(LogLevel.INFO)
			expect(entryArg.context).toBe(logger.context)
			expect(entryArg.args).toEqual(['msg1', { foo: 'bar' }])

			expect(formatterSpy).toHaveBeenCalledTimes(1)
			expect(formatterSpy).toHaveBeenCalledWith(entryArg)

			expect(infoSpy).toHaveBeenCalledTimes(1)
			const consoleArgs = infoSpy.mock.calls[0] as unknown[]

			expect(consoleArgs[0]).toBe('formatted')
			expect(consoleArgs[1]).toBe(LogLevel.INFO)
		})
	})

	describe('level helpers', () => {
		it('forward to log with correct level', () => {
			const logger = createTestLogger()
			const logSpy = vi.spyOn(logger, 'log')

			logger.fatal('a')
			logger.error('b')
			logger.warn('c')
			logger.success('d')
			logger.info('e')
			logger.debug('f')
			logger.verbose('g')
			logger.trace('h')

			expect(logSpy).toHaveBeenCalledWith(LogLevel.FATAL, 'a')
			expect(logSpy).toHaveBeenCalledWith(LogLevel.ERROR, 'b')
			expect(logSpy).toHaveBeenCalledWith(LogLevel.WARNING, 'c')
			expect(logSpy).toHaveBeenCalledWith(LogLevel.SUCCESS, 'd')
			expect(logSpy).toHaveBeenCalledWith(LogLevel.INFO, 'e')
			expect(logSpy).toHaveBeenCalledWith(LogLevel.DEBUG, 'f')
			expect(logSpy).toHaveBeenCalledWith(LogLevel.VERBOSE, 'g')
			expect(logSpy).toHaveBeenCalledWith(LogLevel.TRACE, 'h')
		})
	})

	describe('lazy', () => {
		it('evaluates thunk and processes log only when allowed by minLevel', () => {
			const logger = createTestLogger()
			logger.setMinLevel(LogLevel.INFO)

			const thunkDebug = vi.fn(() => ['debug payload'])
			const thunkInfo = vi.fn(() => ['info payload'])
			const notifySpy = vi.spyOn(LoggerObserver, 'notify')

			logger.lazy.debug(thunkDebug)
			logger.lazy.info(thunkInfo)

			expect(thunkDebug).not.toHaveBeenCalled()
			expect(thunkInfo).toHaveBeenCalledTimes(1)

			expect(notifySpy).toHaveBeenCalledTimes(1)
			const [entryArg] = notifySpy.mock.calls[0]
			expect(entryArg.level).toBe(LogLevel.INFO)
			expect(entryArg.args).toEqual(['info payload'])
		})

		it('catches thunk errors and routes to failsafe error log', () => {
			const logger = createTestLogger()
			logger.setMinLevel(LogLevel.INFO)
			const notifySpy = vi.spyOn(LoggerObserver, 'notify')

			const badThunk = vi.fn(() => {
				throw new Error('Thunk crash')
			})

			expect(() => logger.lazy.info(badThunk)).not.toThrow()

			expect(notifySpy).toHaveBeenCalledTimes(1)

			const [entryArg] = notifySpy.mock.calls[0]
			expect(entryArg.level).toBe(LogLevel.INFO)
			expect(entryArg.args[0]).toContain('Lazy evaluation failed')
		})

		it('level helpers forward to lazy core with correct level', () => {
			const logger = createTestLogger()
			const notifySpy = vi.spyOn(LoggerObserver, 'notify')

			logger.lazy.fatal(() => ['a'])
			logger.lazy.error(() => ['b'])
			logger.lazy.warn(() => ['c'])
			logger.lazy.success(() => ['d'])
			logger.lazy.info(() => ['e'])
			logger.lazy.debug(() => ['f'])
			logger.lazy.verbose(() => ['g'])
			logger.lazy.trace(() => ['h'])

			expect(notifySpy).toHaveBeenCalledTimes(8)
			const calls = notifySpy.mock.calls.map(call => [call[0].level, call[0].args[0]])

			expect(calls).toEqual([
				[LogLevel.FATAL, 'a'],
				[LogLevel.ERROR, 'b'],
				[LogLevel.WARNING, 'c'],
				[LogLevel.SUCCESS, 'd'],
				[LogLevel.INFO, 'e'],
				[LogLevel.DEBUG, 'f'],
				[LogLevel.VERBOSE, 'g'],
				[LogLevel.TRACE, 'h'],
			])
		})
	})

	describe('_getTimeDiff', () => {
		it('returns global difference by default', () => {
			vi.spyOn(Date, 'now').mockReturnValue(2000)

			TestLogger._setGlobalTs(1000)
			const logger = createTestLogger({})

			const v = logger._callGetTimeDiff()
			expect(v).toBe(1000)
		})

		it('supports global scope', () => {
			vi.spyOn(Date, 'now').mockReturnValue(1000)

			TestLogger._setGlobalTs(900)
			const logger = createTestLogger({ timeDiff: 'global' })

			const diff = logger._callGetTimeDiff()
			expect(diff).toBe(100)
		})

		it('supports local scope', () => {
			vi.spyOn(Date, 'now').mockReturnValue(5000)

			const logger = createTestLogger({ timeDiff: 'local' })
			logger._setLocalTs(4800)

			const diff = logger._callGetTimeDiff()
			expect(diff).toBe(200)
		})
	})

	describe('child', () => {
		it('throws if context is missing', () => {
			const logger = createTestLogger()

			// @ts-expect-error should throw on missing context
			expect(() => logger.child()).toThrowError(/requires a context string or loggeroptions/iu)

			expect(() => logger.child({} as LoggerOptions)).toThrowError(
				/requires a context string or loggeroptions/iu,
			)
		})

		it('string overload creates child logger with namespaced context and merged options', () => {
			const parent = createTestLogger({
				context: 'PARENT',
				inspectOptions: { depth: 1 },
				dateTimeFormat: { locale: 'en-US', hour12: true },
				colors: true,
			})

			const child = parent.child('CH', {
				inspectOptions: { colors: false },
				dateTimeFormat: { hour12: false },
				colors: false,
			})

			expect(child).toBeInstanceOf(TestLogger)

			const childOptions = (child as TestLogger).options

			expect(childOptions.context).toBe('PARENT:CH')
			expect(childOptions.inspectOptions).toEqual({ depth: 1, colors: false })
			expect(childOptions.dateTimeFormat).toEqual({ locale: 'en-US', hour12: false })
			expect(childOptions.colors).toBe(false)
		})

		it('options overload uses options.context and merges inspectOptions when only child provides it', () => {
			const parent = createTestLogger({
				context: 'P',
				inspectOptions: undefined,
				dateTimeFormat: { locale: 'ru-RU' },
			})

			const child = parent.child({
				context: 'C',
				inspectOptions: { depth: 7 },
			} as LoggerOptions)

			expect(child).toBeInstanceOf(TestLogger)

			const childOptions = (child as TestLogger).options

			expect(childOptions.context).toBe('P:C')
			expect(childOptions.inspectOptions).toEqual({ depth: 7 })
			expect(childOptions.dateTimeFormat).toEqual({ locale: 'ru-RU' })
		})

		it('merges dateTimeFormat branches: child function wins; child object merges even if parent is a function; child undefined keeps parent function', () => {
			const parentFn = vi.fn((d: Date) => d.toISOString())
			const childFn = vi.fn((d: Date) => String(d.getTime()))

			const parent = createTestLogger({
				context: 'P',
				dateTimeFormat: parentFn,
			})

			let child = parent.child('A', { dateTimeFormat: childFn })
			let childOptions = (child as TestLogger).options
			expect(childOptions.dateTimeFormat).toBe(childFn)

			child = parent.child('B', { dateTimeFormat: { locale: 'en-GB' } })
			childOptions = (child as TestLogger).options
			expect(childOptions.dateTimeFormat).toEqual({ locale: 'en-GB' })

			child = parent.child('C', {})
			childOptions = (child as TestLogger).options
			expect(childOptions.dateTimeFormat).toBe(parentFn)
		})
	})
})
