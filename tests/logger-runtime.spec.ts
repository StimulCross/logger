import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LogLevel } from '../src/enums/log-level.js';
import { LoggerRuntime } from '../src/logger-runtime.js';

describe('LoggerRuntime', () => {
	const snapshot = () => ({
		isEnabled: LoggerRuntime.isEnabled,
		globalMinLevel: LoggerRuntime.globalMinLevel,
	});

	let initial: ReturnType<typeof snapshot>;

	beforeEach(() => {
		vi.restoreAllMocks();
		initial = snapshot();
	});

	afterEach(() => {
		LoggerRuntime.setEnabled(initial.isEnabled);
		LoggerRuntime.setGlobalMinLevel(initial.globalMinLevel);
		vi.restoreAllMocks();
	});

	it('has defaults: isEnabled=true, globalMinLevel=null', () => {
		LoggerRuntime.setEnabled(true);
		LoggerRuntime.setGlobalMinLevel(null);

		expect(LoggerRuntime.isEnabled).toBe(true);
		expect(LoggerRuntime.globalMinLevel).toBeNull();
	});

	describe('setEnabled()', () => {
		it('toggles global enabled flag', () => {
			LoggerRuntime.setEnabled(false);
			expect(LoggerRuntime.isEnabled).toBe(false);

			LoggerRuntime.setEnabled(true);
			expect(LoggerRuntime.isEnabled).toBe(true);
		});
	});

	describe('setGlobalMinLevel()', () => {
		it('accepts enum numeric level', () => {
			LoggerRuntime.setGlobalMinLevel(LogLevel.WARNING);
			expect(LoggerRuntime.globalMinLevel).toBe(LogLevel.WARNING);
		});

		it('accepts string / lowercase string levels', () => {
			LoggerRuntime.setGlobalMinLevel('ERROR');
			expect(LoggerRuntime.globalMinLevel).toBe(LogLevel.ERROR);

			LoggerRuntime.setGlobalMinLevel('trace');
			expect(LoggerRuntime.globalMinLevel).toBe(LogLevel.TRACE);
		});

		it('clears global override when null passed', () => {
			LoggerRuntime.setGlobalMinLevel('INFO');
			expect(LoggerRuntime.globalMinLevel).toBe(LogLevel.INFO);

			LoggerRuntime.setGlobalMinLevel(null);
			expect(LoggerRuntime.globalMinLevel).toBeNull();
		});
	});
});
