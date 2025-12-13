import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogLevel, type LoggerOverrideConfig } from '../src/index.js';
import { CustomLoggerStrategy } from '../src/strategies/custom-logger.strategy.js';

describe('CustomLoggerStrategy', () => {
	let baseLog: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		baseLog = vi.fn();
	});

	describe('function override', () => {
		it('should route log() to override.log when allowed', () => {
			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.TRACE,
				custom: baseLog as unknown as LoggerOverrideConfig,
			});

			logger.log(LogLevel.INFO, 'a');
			logger.log(LogLevel.TRACE, 'b');

			expect(baseLog).toHaveBeenCalledTimes(2);
			expect(baseLog).toHaveBeenNthCalledWith(1, LogLevel.INFO, 'a');
			expect(baseLog).toHaveBeenNthCalledWith(2, LogLevel.TRACE, 'b');
		});

		it('should respect minLevel filter', () => {
			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.ERROR,
				custom: baseLog as unknown as LoggerOverrideConfig,
			});

			logger.log(LogLevel.FATAL, 'ok');
			logger.log(LogLevel.ERROR, 'ok');
			logger.log(LogLevel.WARNING, 'no');
			logger.log(LogLevel.INFO, 'no');

			expect(baseLog).toHaveBeenCalledTimes(2);
			expect(baseLog).toHaveBeenNthCalledWith(1, LogLevel.FATAL, 'ok');
			expect(baseLog).toHaveBeenNthCalledWith(2, LogLevel.ERROR, 'ok');
		});
	});

	describe('object override', () => {
		it('should fallback to log() when specific method missing (fatal/error/warn/info/debug/trace)', () => {
			const override: LoggerOverrideConfig = { log: baseLog as (level: LogLevel, ...args: unknown[]) => void };
			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.TRACE,
				custom: override,
			});

			logger.fatal('f');
			logger.error('e');
			logger.warn('w');
			logger.info('i');
			logger.debug('d');
			logger.trace('t');

			expect(baseLog).toHaveBeenCalledTimes(6);
			expect(baseLog).toHaveBeenNthCalledWith(1, LogLevel.FATAL, 'f');
			expect(baseLog).toHaveBeenNthCalledWith(2, LogLevel.ERROR, 'e');
			expect(baseLog).toHaveBeenNthCalledWith(3, LogLevel.WARNING, 'w');
			expect(baseLog).toHaveBeenNthCalledWith(4, LogLevel.INFO, 'i');
			expect(baseLog).toHaveBeenNthCalledWith(5, LogLevel.DEBUG, 'd');
			expect(baseLog).toHaveBeenNthCalledWith(6, LogLevel.TRACE, 't');
		});

		it('should use specific methods when provided and allowed by minLevel', () => {
			const fatal = vi.fn();
			const error = vi.fn();
			const info = vi.fn();

			const override: LoggerOverrideConfig = {
				log: baseLog as (level: LogLevel, ...args: unknown[]) => void,
				fatal,
				error,
				info,
			};

			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.WARNING,
				custom: override,
			});

			logger.fatal('f');
			logger.error('e');
			logger.info('i'); // should not call info()
			logger.warn('w'); // fallback to log()

			expect(fatal).toHaveBeenCalledWith('f');
			expect(error).toHaveBeenCalledWith('e');
			expect(info).not.toHaveBeenCalled();

			expect(baseLog).toHaveBeenCalledTimes(1);
			expect(baseLog).toHaveBeenCalledWith(LogLevel.WARNING, 'w');
		});

		it('setContext/setMinLevel should update behavior', () => {
			const logger = new CustomLoggerStrategy({
				context: 'A',
				minLevel: LogLevel.TRACE,
				custom: baseLog as unknown as LoggerOverrideConfig,
			});

			logger.setContext('B');
			logger.setMinLevel(LogLevel.ERROR);

			logger.log(LogLevel.INFO, 'no');
			logger.log(LogLevel.ERROR, 'yes');

			expect(baseLog).toHaveBeenCalledTimes(1);
			expect(baseLog).toHaveBeenCalledWith(LogLevel.ERROR, 'yes');
		});
	});
});
