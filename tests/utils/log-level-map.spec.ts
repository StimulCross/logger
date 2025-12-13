import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LogLevel } from '../../src/index.js';

describe('log-level-map', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	async function importMap() {
		return await import('../../src/utils/log-level-map.js');
	}

	it('logLevelToConsoleFunction should call proper console methods', async () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
		const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});

		const { logLevelToConsoleFunction } = await importMap();

		logLevelToConsoleFunction[LogLevel.FATAL]('x');
		logLevelToConsoleFunction[LogLevel.ERROR]('x');
		logLevelToConsoleFunction[LogLevel.WARNING]('x');
		logLevelToConsoleFunction[LogLevel.SUCCESS]('x');
		logLevelToConsoleFunction[LogLevel.INFO]('x');
		logLevelToConsoleFunction[LogLevel.DEBUG]('x');
		logLevelToConsoleFunction[LogLevel.TRACE]('x');

		expect(errorSpy).toHaveBeenCalledTimes(2); // fatal + error
		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(infoSpy).toHaveBeenCalledTimes(2); // info + success
		expect(debugSpy).toHaveBeenCalledTimes(1);
		expect(traceSpy).toHaveBeenCalledTimes(1);
	});

	it('logLevelToType should contain padded fixed-width strings', async () => {
		const { logLevelToType } = await importMap();

		const values = Object.values(logLevelToType);
		expect(values.length).toBeGreaterThan(0);

		const len = values[0].length;

		for (const v of values) {
			expect(v.length).toBe(len);
		}

		expect(logLevelToType[LogLevel.ERROR]).toMatch(/ERROR/u);
		expect(logLevelToType[LogLevel.INFO]).toMatch(/INFO/u);
	});

	it('styling maps should return ANSI-wrapped strings', async () => {
		const { logLevelToTypeColor, logLevelToColor, logLevelToBackgroundColor } = await importMap();

		const sample = 'Hello';

		const colored = logLevelToColor[LogLevel.WARNING](sample);
		expect(colored).toContain(sample);
		// eslint-disable-next-line no-control-regex
		expect(colored).toMatch(/^\u001B\[\d+m/u);
		// eslint-disable-next-line no-control-regex
		expect(colored).toMatch(/\u001B\[\d+m$/u);

		const typeColored = logLevelToTypeColor[LogLevel.ERROR](sample);
		expect(typeColored).toContain(sample);
		expect(typeColored).toContain('\u001B[');

		const bg = logLevelToBackgroundColor[LogLevel.FATAL](sample);
		expect(bg).toContain(sample);
		expect(bg).toContain('\u001B[');
	});
});
