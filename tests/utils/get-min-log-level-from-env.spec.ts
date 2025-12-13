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

	it('should return undefined if LOGGING env is not set', async () => {
		const { getMinLogLevelFromEnv } = await getUtil();
		expect(getMinLogLevelFromEnv('AnyContext')).toBeUndefined();
	});

	it('should return default level defined in env', async () => {
		vi.stubEnv('LOGGING', 'default=ERROR');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('MyModule')).toBe(LogLevel.ERROR);
		expect(getMinLogLevelFromEnv('OtherModule')).toBe(LogLevel.ERROR);
	});

	it('should match specific namespace exactly', async () => {
		vi.stubEnv('LOGGING', 'MyModule=DEBUG;default=INFO');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('MyModule')).toBe(LogLevel.DEBUG);
		expect(getMinLogLevelFromEnv('OtherModule')).toBe(LogLevel.INFO);
	});

	it('should match nested namespaces (prefix matching)', async () => {
		vi.stubEnv('LOGGING', 'app:db=TRACE;app:ui=WARNING;default=INFO');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app:db:connection')).toBe(LogLevel.TRACE);
		expect(getMinLogLevelFromEnv('app:db:pool')).toBe(LogLevel.TRACE);
		expect(getMinLogLevelFromEnv('app:ui:button')).toBe(LogLevel.WARNING);
		expect(getMinLogLevelFromEnv('app:other')).toBe(LogLevel.INFO);
	});

	it('should prioritise more specific match', async () => {
		vi.stubEnv('LOGGING', 'app:feature:deep=FATAL;app:feature=DEBUG');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app:feature:deep')).toBe(LogLevel.FATAL);
		expect(getMinLogLevelFromEnv('app:feature:shallow')).toBe(LogLevel.DEBUG);
	});

	it('should ignore invalid LOGGING parts (no "=" or empty level)', async () => {
		vi.stubEnv('LOGGING', 'badPart;alsoBad=;app=INFO;default=WARNING');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app')).toBe(LogLevel.INFO);
		expect(getMinLogLevelFromEnv('other')).toBe(LogLevel.WARNING);
	});

	it('should return undefined when no default is set and no namespace matches', async () => {
		vi.stubEnv('LOGGING', 'app:db=ERROR');

		const { getMinLogLevelFromEnv } = await getUtil();

		expect(getMinLogLevelFromEnv('app:db:conn')).toBe(LogLevel.ERROR);
		expect(getMinLogLevelFromEnv('app:ui')).toBeUndefined();
	});
});
