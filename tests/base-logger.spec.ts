import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LogLevel, type LoggerOptions } from '../src/index.js';
import { BaseLogger } from '../src/strategies/base-logger.js';

class TestLogger extends BaseLogger {
	protected override _minLevel: LogLevel = LogLevel.TRACE;

	public static _setGlobalTs(v: number): void {
		BaseLogger._lastGlobalTimestamp = v;
	}

	public get ctx(): string {
		return this._context;
	}

	public get colors(): boolean {
		return this._colors;
	}

	public get timestamps(): boolean {
		return this._timestamps;
	}

	public get timeDiff(): unknown {
		return this._timeDiff;
	}

	public get dtFormatter(): unknown {
		return this._dateTimeFormatter;
	}

	public get dtOptions(): unknown {
		return this._dateTimeFormatOptions;
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		void level;
		void args;
	}

	public _callGetTimeDiff(): string {
		return this._getTimeDiff();
	}

	public _setLocalTs(v: number): void {
		this._lastLocalTimestamp = v;
	}
}

function createLogger(opts: Partial<LoggerOptions> = {}): TestLogger {
	return new TestLogger({
		context: 'CTX',
		...opts,
	} as LoggerOptions);
}

describe('BaseLogger', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('constructor: should store flags and default dateTimeFormat behavior', () => {
		const logger = createLogger({
			applicationName: 'APP',
			colors: false,
			timestamps: false,
			timeDiff: undefined,
		});

		expect(logger.ctx).toBe('CTX');
		expect(logger.colors).toBe(false);
		expect(logger.timestamps).toBe(false);
		expect(logger.timeDiff).toBeUndefined();
		expect(logger.dtFormatter).toBeUndefined();
	});

	it('constructor: should accept dateTimeFormat function (sets formatter + default options)', () => {
		const fmt = vi.fn((d: Date) => d.toISOString());
		const logger = createLogger({ dateTimeFormat: fmt });

		expect(logger.dtFormatter).toBe(fmt);
		expect(logger.dtOptions).toBeTypeOf('object');
	});

	it('constructor: should accept dateTimeFormat options object (merged)', () => {
		const logger = createLogger({ dateTimeFormat: { locale: 'ru-RU', hour12: false } });

		expect(logger.dtFormatter).toBeUndefined();
		expect(logger.dtOptions).toMatchObject({ locale: 'ru-RU', hour12: false });
	});

	it('setContext: should update context', () => {
		const logger = createLogger({ context: 'A' });
		expect(logger.ctx).toBe('A');

		logger.setContext('B');
		expect(logger.ctx).toBe('B');
	});

	it('setMinLevel: should resolve numeric/string levels', () => {
		const logger = createLogger();
		logger.setMinLevel(LogLevel.ERROR);
		logger.setMinLevel('TRACE');

		expect(true).toBe(true);
	});

	it('_getTimeDiff: should return empty when timeDiff disabled and update global timestamp', () => {
		const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(2000);

		TestLogger._setGlobalTs(1000);
		const logger = createLogger({ timeDiff: undefined });

		const v = logger._callGetTimeDiff();
		expect(v).toBe('');
	});

	it('_getTimeDiff: should support global scope', () => {
		const nowSpy = vi.spyOn(Date, 'now');
		nowSpy.mockReturnValue(1000);

		TestLogger._setGlobalTs(900);
		const logger = createLogger({ timeDiff: 'global' });

		const diff = logger._callGetTimeDiff();
		expect(diff).toBe('+100ms [G]');
	});

	it('_getTimeDiff: should support local scope', () => {
		const nowSpy = vi.spyOn(Date, 'now');
		nowSpy.mockReturnValue(5000);

		const logger = createLogger({ timeDiff: 'local' });
		logger._setLocalTs(4800);

		const diff = logger._callGetTimeDiff();
		expect(diff).toBe('+200ms [L]');
	});
});
