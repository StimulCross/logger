import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('detectRuntime', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should detect Browser by document', async () => {
		vi.stubGlobal('document', {});
		const { detectRuntime, Runtime } = await import('../../src/utils/detect-runtime.js');
		expect(detectRuntime()).toBe(Runtime.Browser);
	});

	it('should detect Deno', async () => {
		vi.stubGlobal('Deno', {});
		const { detectRuntime, Runtime } = await import('../../src/utils/detect-runtime.js');
		expect(detectRuntime()).toBe(Runtime.Deno);
	});

	it('should detect Bun', async () => {
		vi.stubGlobal('Bun', {});
		const { detectRuntime, Runtime } = await import('../../src/utils/detect-runtime.js');
		expect(detectRuntime()).toBe(Runtime.Bun);
	});

	it('should detect Node by process.release.name', async () => {
		const { detectRuntime, Runtime } = await import('../../src/utils/detect-runtime.js');
		expect(detectRuntime()).toBe(Runtime.Node);
	});

	it('should return null when nothing matches (simulated)', async () => {
		vi.stubGlobal('document', undefined);
		vi.stubGlobal('Deno', undefined);
		vi.stubGlobal('Bun', undefined);

		const originalRelease = process.release;

		try {
			Object.defineProperty(process, 'release', {
				configurable: true,
				value: { ...originalRelease, name: 'not-node' },
			});

			const { detectRuntime } = await import('../../src/utils/detect-runtime.js');
			expect(detectRuntime()).toBeNull();
		} finally {
			Object.defineProperty(process, 'release', {
				configurable: true,
				value: originalRelease,
			});
		}
	});
});
