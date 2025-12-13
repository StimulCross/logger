import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type LogLevel } from '../src/index.js';

describe('createLogger', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('should return CustomLoggerStrategy when custom provided', async () => {
		const { createLogger } = await import('../src/create-logger.js');
		const logger = createLogger({
			context: 'CTX',
			custom: (level: LogLevel, ...args: unknown[]) => void [level, args],
		});

		expect(logger.constructor.name).toBe('CustomLoggerStrategy');
	});

	it('should select Browser strategy', async () => {
		vi.doMock('../src/utils/detect-runtime.js', async () => {
			const actual = await vi.importActual<any>('../src/utils/detect-runtime.js');
			return { ...actual, detectRuntime: () => actual.Runtime.Browser };
		});

		const { createLogger } = await import('../src/create-logger.js');
		const logger = createLogger('CTX', { colors: false, timestamps: false });

		expect(logger.constructor.name).toBe('BrowserLoggerStrategy');
	});

	it('should select Deno strategy', async () => {
		vi.doMock('../src/utils/detect-runtime.js', async () => {
			const actual = await vi.importActual<any>('../src/utils/detect-runtime.js');
			return { ...actual, detectRuntime: () => actual.Runtime.Deno };
		});

		const { createLogger } = await import('../src/create-logger.js');
		const logger = createLogger('CTX', { colors: false, timestamps: false });

		expect(logger.constructor.name).toBe('DenoLoggerStrategy');
	});

	it('should select Bun strategy', async () => {
		vi.doMock('../src/utils/detect-runtime.js', async () => {
			const actual = await vi.importActual<any>('../src/utils/detect-runtime.js');
			return { ...actual, detectRuntime: () => actual.Runtime.Bun };
		});

		const { createLogger } = await import('../src/create-logger.js');
		const logger = createLogger('CTX', { colors: false, timestamps: false });

		expect(logger.constructor.name).toBe('BunLoggerStrategy');
	});

	it('should default to Node strategy when runtime is null', async () => {
		vi.doMock('../src/utils/detect-runtime.js', async () => {
			const actual = await vi.importActual<any>('../src/utils/detect-runtime.js');
			return { ...actual, detectRuntime: () => null };
		});

		const { createLogger } = await import('../src/create-logger.js');
		const logger = createLogger('CTX', { colors: false, timestamps: false });

		expect(logger.constructor.name).toBe('NodeLoggerStrategy');
	});
});
