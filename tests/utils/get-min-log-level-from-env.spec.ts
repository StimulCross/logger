import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LogLevel } from '../../src/index.js';

describe('getMinLogLevelFromEnv', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	async function getUtil() {
		return await import('../../src/utils/get-min-log-level-from-env.js');
	}

	it('returns undefined if LOGGING env is not set', async () => {
		const { getMinLogLevelFromEnv } = await getUtil();
		expect(getMinLogLevelFromEnv('AnyContext')).toBeUndefined();
	});

	it('supports case-insensitive default and log level', async () => {
		vi.stubEnv('LOGGING', 'DeFaUlT=error');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('MyModule')).toBe(LogLevel.ERROR);
		expect(getMinLogLevelFromEnv('OtherModule')).toBe(LogLevel.ERROR);
	});

	it('matches specific namespace exactly', async () => {
		vi.stubEnv('LOGGING', 'MyModule=debug;DEFAULT=info');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('MyModule')).toBe(LogLevel.DEBUG);
		expect(getMinLogLevelFromEnv('OtherModule')).toBe(LogLevel.INFO);
	});

	it('matches nested namespaces using prefix logic', async () => {
		vi.stubEnv('LOGGING', 'app:db=trace;app:ui=warning;default=info');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app:db:connection')).toBe(LogLevel.TRACE);
		expect(getMinLogLevelFromEnv('app:db:pool')).toBe(LogLevel.TRACE);
		expect(getMinLogLevelFromEnv('app:ui:button')).toBe(LogLevel.WARNING);
		expect(getMinLogLevelFromEnv('app:other')).toBe(LogLevel.INFO);
	});

	it('prioritises more specific namespaces', async () => {
		vi.stubEnv('LOGGING', 'app:feature:deep=fatal;app:feature=debug');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app:feature:deep')).toBe(LogLevel.FATAL);
		expect(getMinLogLevelFromEnv('app:feature:shallow')).toBe(LogLevel.DEBUG);
	});

	it('handles whitespace and trims all parts', async () => {
		vi.stubEnv('LOGGING', '  default = warning ;  app : db = error ; app = info  ');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app:db:conn')).toBe(LogLevel.ERROR);
		expect(getMinLogLevelFromEnv('app:ui')).toBe(LogLevel.INFO);
		expect(getMinLogLevelFromEnv('other')).toBe(LogLevel.WARNING);
	});

	it('ignores invalid parts', async () => {
		vi.stubEnv('LOGGING', 'badPart;alsoBad=;app=INFO;DEFAULT=WARNING');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app')).toBe(LogLevel.INFO);
		expect(getMinLogLevelFromEnv('other')).toBe(LogLevel.WARNING);
	});

	it('returns undefined when no default exists and no rule matches', async () => {
		vi.stubEnv('LOGGING', 'app:db=ERROR');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app:db:conn')).toBe(LogLevel.ERROR);
		expect(getMinLogLevelFromEnv('app:ui')).toBeUndefined();
	});
});
