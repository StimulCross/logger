/** @internal */
export enum Runtime {
	Node = 'node',
	Deno = 'deno',
	Bun = 'bun',
}

/** @internal */
export function detectRuntime(): Runtime | null {
	// @ts-expect-error Types
	if (globalThis.Deno !== undefined)
		return Runtime.Deno

	// @ts-expect-error Types
	if (globalThis.Bun !== undefined)
		return Runtime.Bun

	// Node.js detection
	// eslint-disable-next-line node/prefer-global/process, ts/no-unnecessary-condition
	if (typeof process !== 'undefined' && process?.release?.name?.toLowerCase() === 'node')
		return Runtime.Node

	return null
}
