/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/** @internal */
export const enum Runtime {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	Node = 'node',
	Deno = 'deno',
	Bun = 'bun',
}

/** @internal */
export function detectRuntime(): Runtime | null {
	// @ts-ignore Deno detection
	if (globalThis?.Deno !== undefined) {
		return Runtime.Deno;
	}

	// @ts-ignore Bun detection
	if (globalThis?.Bun !== undefined) {
		return Runtime.Bun;
	}

	// Node.js detection
	if (typeof process !== 'undefined' && process?.release?.name?.toLowerCase() === 'node') {
		return Runtime.Node;
	}

	return null;
}
