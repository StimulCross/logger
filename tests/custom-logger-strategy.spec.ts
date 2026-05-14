import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoggerRuntime } from '../src/common/logger-runtime.js';
import { CustomLoggerStrategy } from '../src/common/strategies/custom-logger.strategy.js';
import { LogLevel, type LoggerOverrideConfig } from '../src/runtime/index.js';

describe('CustomLoggerStrategy', () => {
	let baseLog: ReturnType<typeof vi.fn>;

	const runtimeSnapshot = () => ({
		isEnabled: LoggerRuntime.isEnabled,
		globalMinLevel: LoggerRuntime.globalMinLevel,
	});

	let initialRuntime: ReturnType<typeof runtimeSnapshot>;

	beforeEach(() => {
		baseLog = vi.fn();

		initialRuntime = runtimeSnapshot();
		LoggerRuntime.setEnabled(true);
		LoggerRuntime.setGlobalMinLevel(null);
	});

	afterEach(() => {
		LoggerRuntime.setEnabled(initialRuntime.isEnabled);
		LoggerRuntime.setGlobalMinLevel(initialRuntime.globalMinLevel);
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

		it('should NOT log when LoggerRuntime is disabled', () => {
			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.TRACE,
				custom: baseLog as unknown as LoggerOverrideConfig,
			});

			LoggerRuntime.setEnabled(false);

			logger.log(LogLevel.FATAL, 'nope');
			logger.log(LogLevel.TRACE, 'nope');

			expect(baseLog).not.toHaveBeenCalled();
		});

		it('should respect LoggerRuntime.globalMinLevel (block levels below it)', () => {
			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.TRACE,
				custom: baseLog as unknown as LoggerOverrideConfig,
			});

			LoggerRuntime.setGlobalMinLevel(LogLevel.WARNING);

			logger.log(LogLevel.INFO, 'no');
			logger.log(LogLevel.DEBUG, 'no');
			logger.log(LogLevel.WARNING, 'yes');
			logger.log(LogLevel.ERROR, 'yes');

			expect(baseLog).toHaveBeenCalledTimes(2);
			expect(baseLog).toHaveBeenNthCalledWith(1, LogLevel.WARNING, 'yes');
			expect(baseLog).toHaveBeenNthCalledWith(2, LogLevel.ERROR, 'yes');
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
			logger.info('i');
			logger.warn('w');

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

		it('should NOT call fallback log() when LoggerRuntime is disabled (even via helpers)', () => {
			const override: LoggerOverrideConfig = { log: baseLog as (level: LogLevel, ...args: unknown[]) => void };
			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.TRACE,
				custom: override,
			});

			LoggerRuntime.setEnabled(false);

			logger.warn('w');
			logger.error('e');
			logger.fatal('f');
			logger.trace('t');

			expect(baseLog).not.toHaveBeenCalled();
		});

		it('should NOT call specific override method when LoggerRuntime.globalMinLevel blocks it', () => {
			const info = vi.fn();
			const override: LoggerOverrideConfig = {
				log: baseLog as (level: LogLevel, ...args: unknown[]) => void,
				info,
			};

			const logger = new CustomLoggerStrategy({
				context: 'C',
				minLevel: LogLevel.TRACE,
				custom: override,
			});

			LoggerRuntime.setGlobalMinLevel(LogLevel.WARNING);

			logger.info('i');
			expect(info).not.toHaveBeenCalled();
			expect(baseLog).not.toHaveBeenCalled();
		});
	});
});
