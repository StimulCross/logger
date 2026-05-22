import { describe, expect, it } from 'vitest'
import { DEFAULT_OPTIONS } from '../../src/common/constants.js'
import { resolveLogLevel } from '../../src/common/utils/resolve-log-level.js'
import { LogLevel } from '../../src/runtime/index.js'

function getNumericEnumValues<E extends Record<string, string | number>>(e: E): number[] {
	return Object.keys(e)
		.map(k => Number(k))
		.filter(n => !Number.isNaN(n))
		.sort((a, b) => a - b)
}

describe('resolveLogLevel', () => {
	it('should return exact LogLevel when valid number is provided', () => {
		const numeric = getNumericEnumValues(LogLevel)

		expect(resolveLogLevel(numeric[0])).toBe(numeric[0])
		expect(resolveLogLevel(numeric.at(-1)!)).toBe(numeric.at(-1)!)
	})

	it('should resolve numeric level to the highest known level below it if exact match not found', () => {
		const numeric = getNumericEnumValues(LogLevel)

		let probe: number | null = null

		for (let i = 0; i < numeric.length - 1; i++) {
			const a = numeric[i]
			const b = numeric[i + 1]

			if (b - a > 1) {
				probe = a + 1
				expect(resolveLogLevel(probe)).toBe(a)

				break
			}
		}

		if (probe === null) {
			const aboveMax = numeric.at(-1)! + 1
			expect(resolveLogLevel(aboveMax)).toBe(numeric.at(-1)!)
		}
	})

	it('should return default level if numeric level is below the lowest known level', () => {
		const numeric = getNumericEnumValues(LogLevel)
		const belowMin = numeric[0] - 1

		expect(resolveLogLevel(belowMin)).toBe(DEFAULT_OPTIONS.minLevel)
	})

	it('should resolve string level case-insensitive', () => {
		expect(resolveLogLevel('info')).toBe(LogLevel.INFO)
		expect(resolveLogLevel('INFO')).toBe(LogLevel.INFO)
		// @ts-expect-error mixed case should still work
		expect(resolveLogLevel('InFo')).toBe(LogLevel.INFO)

		expect(resolveLogLevel('error')).toBe(LogLevel.ERROR)
	})

	it('should throw error for unknown string level', () => {
		// @ts-expect-error unknown level should throw
		expect(() => resolveLogLevel('UNKNOWN_LEVEL')).toThrowError(/Unknown log level string:/u)
	})
})
