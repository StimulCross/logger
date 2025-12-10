/** @internal */
export function safeStringify(obj: unknown, spaces?: number): string {
	const visited = new WeakSet();

	return JSON.stringify(
		obj,
		(_key, value) => {
			if (typeof value === 'object' && value !== null) {
				if (visited.has(value)) {
					return '[Circular]';
				}

				visited.add(value);
			}

			return value as unknown;
		},
		spaces,
	);
}
