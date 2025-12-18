/* eslint-disable import/order */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { createLoggerMock } = vi.hoisted(() => ({
	createLoggerMock: vi.fn(),
}));

vi.mock('../src/create-logger.js', () => ({
	createLogger: createLoggerMock,
}));

/* eslint-disable import/first */
import { LogLevel } from '../src/enums/log-level.js';
import { type DateTimeFormatOptions, type LoggerOptions } from '../src/interfaces/logger-options.js';
import { BaseLogger } from '../src/strategies/base-logger.js';
import { DEFAULT_OPTIONS } from '../src/constants.js';
import { LoggerRuntime } from '../src/logger-runtime.js';

class TestLogger extends BaseLogger {
	protected override _minLevel: LogLevel = LogLevel.TRACE;

	public static _setGlobalTs(v: number): void {
		BaseLogger._lastGlobalTimestamp = v;
	}

	public get options(): LoggerOptions {
		return this._options;
	}

	public get ctx(): string {
		return this._options.context;
	}

	public get minLevel(): LogLevel {
		return this._minLevel;
	}

	public get dtFormatter(): Function | undefined {
		return this._dateTimeFormatter;
	}

	public get dtOptions(): DateTimeFormatOptions | undefined {
		return this._dateTimeFormatOptions;
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		void level;
		void args;
	}

	public _callShouldLog(level: LogLevel): boolean {
		return this._shouldLog(level);
	}

	public _callGetTimeDiff(): number | null {
		return this._getTimeDiff();
	}

	public _setLocalTs(v: number): void {
		this._lastLocalTimestamp = v;
	}
}

function createTestLogger(opts: Partial<LoggerOptions> = {}): TestLogger {
	return new TestLogger({
		context: 'CTX',
		...opts,
	} as LoggerOptions);
}

describe('BaseLogger', () => {
	const runtimeSnapshot = () => ({
		isEnabled: LoggerRuntime.isEnabled,
		globalMinLevel: LoggerRuntime.globalMinLevel,
	});

	let initialRuntime: ReturnType<typeof runtimeSnapshot>;

	beforeEach(() => {
		vi.restoreAllMocks();
		createLoggerMock.mockReset();

		initialRuntime = runtimeSnapshot();
		LoggerRuntime.setEnabled(true);
		LoggerRuntime.setGlobalMinLevel(null);
	});

	afterEach(() => {
		LoggerRuntime.setEnabled(initialRuntime.isEnabled);
		LoggerRuntime.setGlobalMinLevel(initialRuntime.globalMinLevel);

		vi.restoreAllMocks();
		createLoggerMock.mockReset();
	});

	describe('constructor', () => {
		it('stores options and keeps default dateTimeFormat options when not provided', () => {
			const logger = createTestLogger({
				applicationName: 'APP',
				colors: false,
				timestamps: false,
				timeDiff: undefined,
			});

			expect(logger.ctx).toBe('CTX');
			expect(logger.options.applicationName).toBe('APP');
			expect(logger.options.colors).toBe(false);
			expect(logger.options.timestamps).toBe(false);
			expect(logger.options.timeDiff).toBeUndefined();
			expect(logger.dtFormatter).toBeUndefined();

			expect(logger.dtOptions).toStrictEqual(DEFAULT_OPTIONS.dateTimeFormat);
		});

		it('accepts dateTimeFormat function (sets formatter + default options)', () => {
			const fmt = vi.fn((d: Date) => d.toISOString());
			const logger = createTestLogger({ dateTimeFormat: fmt });

			expect(logger.dtFormatter).toBe(fmt);
			expect(logger.dtOptions).toBeTypeOf('object');
		});

		it('accepts dateTimeFormat options object (merged with defaults)', () => {
			const logger = createTestLogger({ dateTimeFormat: { locale: 'ru-RU', hour12: false } });

			expect(logger.dtFormatter).toBeUndefined();
			expect(logger.dtOptions).toMatchObject({ locale: 'ru-RU', hour12: false });
		});
	});

	describe('configuration methods', () => {
		it('setContext updates context in options', () => {
			const logger = createTestLogger({ context: 'A' });
			expect(logger.ctx).toBe('A');

			logger.setContext('B');
			expect(logger.ctx).toBe('B');
			expect(logger.options.context).toBe('B');
		});

		it('setMinLevel resolves numeric / string / lowercase string levels', () => {
			const logger = createTestLogger();

			logger.setMinLevel(LogLevel.ERROR);
			expect(logger.minLevel).toBe(LogLevel.ERROR);

			logger.setMinLevel('TRACE');
			expect(logger.minLevel).toBe(LogLevel.TRACE);

			logger.setMinLevel('warning');
			expect(logger.minLevel).toBe(LogLevel.WARNING);
		});
	});

	describe('_shouldLog', () => {
		it('returns true only when minLevel >= level', () => {
			const logger = createTestLogger();
			logger.setMinLevel(LogLevel.INFO);

			expect(logger._callShouldLog(LogLevel.DEBUG)).toBe(false);
			expect(logger._callShouldLog(LogLevel.INFO)).toBe(true);
			expect(logger._callShouldLog(LogLevel.SUCCESS)).toBe(true);
		});

		it('returns false when LoggerRuntime is disabled (even if local minLevel allows)', () => {
			const logger = createTestLogger();
			logger.setMinLevel(LogLevel.TRACE);

			LoggerRuntime.setEnabled(false);

			expect(logger._callShouldLog(LogLevel.FATAL)).toBe(false);
			expect(logger._callShouldLog(LogLevel.TRACE)).toBe(false);
		});

		it('respects LoggerRuntime.globalMinLevel as a global lower bound', () => {
			const logger = createTestLogger();
			logger.setMinLevel(LogLevel.TRACE);

			LoggerRuntime.setGlobalMinLevel(LogLevel.WARNING);

			expect(logger._callShouldLog(LogLevel.INFO)).toBe(false);
			expect(logger._callShouldLog(LogLevel.DEBUG)).toBe(false);
			expect(logger._callShouldLog(LogLevel.WARNING)).toBe(true);
			expect(logger._callShouldLog(LogLevel.ERROR)).toBe(true);
		});
	});

	describe('level helpers', () => {
		it('forward to log with correct level', () => {
			const logger = createTestLogger();
			const logSpy = vi.spyOn(logger, 'log');

			logger.fatal('a');
			logger.error('b');
			logger.warn('c');
			logger.success('d');
			logger.info('e');
			logger.debug('f');
			logger.trace('g');

			expect(logSpy).toHaveBeenCalledWith(LogLevel.FATAL, 'a');
			expect(logSpy).toHaveBeenCalledWith(LogLevel.ERROR, 'b');
			expect(logSpy).toHaveBeenCalledWith(LogLevel.WARNING, 'c');
			expect(logSpy).toHaveBeenCalledWith(LogLevel.SUCCESS, 'd');
			expect(logSpy).toHaveBeenCalledWith(LogLevel.INFO, 'e');
			expect(logSpy).toHaveBeenCalledWith(LogLevel.DEBUG, 'f');
			expect(logSpy).toHaveBeenCalledWith(LogLevel.TRACE, 'g');
		});
	});

	describe('_getTimeDiff', () => {
		it('returns global difference by default', () => {
			vi.spyOn(Date, 'now').mockReturnValue(2000);

			TestLogger._setGlobalTs(1000);
			const logger = createTestLogger({});

			const v = logger._callGetTimeDiff();
			expect(v).toBe(1000);
		});

		it('supports global scope', () => {
			vi.spyOn(Date, 'now').mockReturnValue(1000);

			TestLogger._setGlobalTs(900);
			const logger = createTestLogger({ timeDiff: 'global' });

			const diff = logger._callGetTimeDiff();
			expect(diff).toBe(100);
		});

		it('supports local scope', () => {
			vi.spyOn(Date, 'now').mockReturnValue(5000);

			const logger = createTestLogger({ timeDiff: 'local' });
			logger._setLocalTs(4800);

			const diff = logger._callGetTimeDiff();
			expect(diff).toBe(200);
		});
	});

	describe('child', () => {
		it('throws if context is missing', () => {
			const logger = createTestLogger();

			// @ts-expect-error should throw on missing context
			expect(() => logger.child()).toThrowError(/requires a context string or loggeroptions/iu);
			expect(() => logger.child({} as LoggerOptions)).toThrowError(
				/requires a context string or loggeroptions/iu,
			);
		});

		it('string overload calls createLogger with namespaced context and merged options', () => {
			createLoggerMock.mockReturnValue({ kind: 'child' });

			const parent = createTestLogger({
				context: 'PARENT',
				inspectOptions: { depth: 1 },
				dateTimeFormat: { locale: 'en-US', hour12: true },
				colors: true,
			});

			const childLogger = parent.child('CH', {
				inspectOptions: { colors: false },
				dateTimeFormat: { hour12: false },
				colors: false,
			});

			expect(childLogger).toEqual({ kind: 'child' });

			expect(createLoggerMock).toHaveBeenCalledTimes(1);
			const [ctxArg, optionsArg] = createLoggerMock.mock.calls[0] as [string, LoggerOptions];

			expect(ctxArg).toBe('PARENT:CH');
			expect(optionsArg.inspectOptions).toEqual({ depth: 1, colors: false });
			expect(optionsArg.dateTimeFormat).toEqual({ locale: 'en-US', hour12: false });
			expect(optionsArg.colors).toBe(false);
		});

		it('options overload uses options.context and merges inspectOptions when only child provides it', () => {
			createLoggerMock.mockReturnValue({ kind: 'child2' });

			const parent = createTestLogger({
				context: 'P',
				inspectOptions: undefined,
				dateTimeFormat: { locale: 'ru-RU' },
			});

			parent.child({
				context: 'C',
				inspectOptions: { depth: 7 },
			} as LoggerOptions);

			const [ctxArg, optionsArg] = createLoggerMock.mock.calls[0] as [string, LoggerOptions];

			expect(ctxArg).toBe('P:C');
			expect(optionsArg.inspectOptions).toEqual({ depth: 7 });
			expect(optionsArg.dateTimeFormat).toEqual({ locale: 'ru-RU' });
		});

		it('merges dateTimeFormat branches: child function wins; child object merges even if parent is a function; child undefined keeps parent function', () => {
			createLoggerMock.mockReturnValue({});

			const parentFn = vi.fn((d: Date) => d.toISOString());
			const childFn = vi.fn((d: Date) => String(d.getTime()));

			const parent = createTestLogger({
				context: 'P',
				dateTimeFormat: parentFn,
			});

			parent.child('A', { dateTimeFormat: childFn });
			let [, optionsArg] = createLoggerMock.mock.calls.at(-1) as [string, LoggerOptions];
			expect(optionsArg.dateTimeFormat).toBe(childFn);

			parent.child('B', { dateTimeFormat: { locale: 'en-GB' } });
			[, optionsArg] = createLoggerMock.mock.calls.at(-1) as [string, LoggerOptions];
			expect(optionsArg.dateTimeFormat).toEqual({ locale: 'en-GB' });

			parent.child('C', {});
			[, optionsArg] = createLoggerMock.mock.calls.at(-1) as [string, LoggerOptions];
			expect(optionsArg.dateTimeFormat).toBe(parentFn);
		});
	});
});
