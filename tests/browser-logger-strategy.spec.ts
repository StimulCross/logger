import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LogLevel, type LoggerOptions } from '../src/index.js';
import { BrowserLoggerStrategy } from '../src/strategies/browser-logger.strategy.js';
import { logLevelToConsoleFunction } from '../src/utils/log-level-map.js';

describe('BrowserLoggerStrategy', () => {
	const originalFns = { ...logLevelToConsoleFunction };

	let infoFn: ReturnType<typeof vi.fn<(...args: unknown[]) => void>>;

	beforeEach(() => {
		infoFn = vi.fn<(...args: unknown[]) => void>();
		logLevelToConsoleFunction[LogLevel.INFO] = infoFn;
	});

	afterEach(() => {
		logLevelToConsoleFunction[LogLevel.INFO] = originalFns[LogLevel.INFO];
		vi.restoreAllMocks();
	});

	function createLogger(opts: Partial<LoggerOptions> = {}): BrowserLoggerStrategy {
		return new BrowserLoggerStrategy({
			context: 'CTX',
			colors: false,
			timestamps: false,
			timeDiff: undefined,
			...opts,
		});
	}

	it('should not log when below minLevel', () => {
		const logger = createLogger({ minLevel: LogLevel.ERROR });
		logger.log(LogLevel.INFO, 'nope');

		expect(infoFn).not.toHaveBeenCalled();
	});

	it('should build template with app/context and objects/strings', () => {
		const logger = createLogger({
			minLevel: LogLevel.TRACE,
			applicationName: 'APP',
			colors: false,
			timestamps: false,
		});

		logger.log(LogLevel.INFO, 'msg', { a: 1 }, 123);

		expect(infoFn).toHaveBeenCalledTimes(1);

		const [template, ...args] = infoFn.mock.calls[0];
		expect(template).toBeTypeOf('string');

		expect(String(template)).toContain('%s');
		expect(String(template)).toContain('%o');
		expect(args[0]).toBe('[APP]');
		expect(String(args[1])).toContain('INFO');
		expect(args[2]).toBe('[CTX]');
		expect(args[3]).toBe('msg');
		expect(args[4]).toEqual({ a: 1 });
		expect(args[5]).toBe(123);
	});

	it('should include timestamps when enabled', () => {
		const logger = createLogger({
			minLevel: LogLevel.TRACE,
			timestamps: true,
			colors: false,
		});

		logger.log(LogLevel.INFO, 'x');

		expect(infoFn).toHaveBeenCalledTimes(1);
		const [, ...args] = infoFn.mock.calls[0];

		const maybeTimestamp = args.find(v => typeof v === 'string' && String(v).includes(':'));
		expect(maybeTimestamp).toBeTruthy();
	});

	it('should include timeDiff when enabled', () => {
		const nowSpy = vi.spyOn(Date, 'now');
		nowSpy.mockReturnValue(1000);

		const logger = createLogger({
			minLevel: LogLevel.TRACE,
			timeDiff: 'local',
			colors: false,
		});

		logger.log(LogLevel.INFO, 'first');
		nowSpy.mockReturnValue(1200);
		logger.log(LogLevel.INFO, 'second');

		expect(infoFn).toHaveBeenCalledTimes(2);
		const [, ...args2] = infoFn.mock.calls[1];

		expect(String(args2.at(-1))).toMatch(/\+\d+ms \[L\]/u);
	});

	it('should work with colors enabled (template still string, but has ANSI sequences)', () => {
		const logger = createLogger({
			minLevel: LogLevel.TRACE,
			colors: true,
			timestamps: false,
			applicationName: 'APP',
		});

		logger.log(LogLevel.INFO, 'hi');

		expect(infoFn).toHaveBeenCalledTimes(1);
		const [template] = infoFn.mock.calls[0];

		expect(String(template)).toContain('%s');
		expect(String(template)).toContain('\u001B[');
	});
});
