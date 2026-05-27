import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LogLevel } from '../../src/runtime/index.js'

describe('log-level-map', () => {
	beforeEach(() => {
		vi.resetModules()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	async function importMap() {
		return await import('../../src/common/utils/log-level-map.js')
	}

	it('logLevelToConsoleFunction should call proper console methods', async () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
		const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
		const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {})

		const { LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP } = await importMap()

		LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.FATAL]('x')
		LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.ERROR]('x')
		LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.WARNING]('x')
		LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.SUCCESS]('x')
		LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.INFO]('x')
		LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.DEBUG]('x')
		LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.TRACE]('x')

		expect(errorSpy).toHaveBeenCalledTimes(2) // fatal + error
		expect(warnSpy).toHaveBeenCalledTimes(1)
		expect(infoSpy).toHaveBeenCalledTimes(2) // info + success
		expect(debugSpy).toHaveBeenCalledTimes(1)
		expect(traceSpy).toHaveBeenCalledTimes(1)
	})

	it('logLevelToType should contain padded fixed-width strings', async () => {
		const { LOG_LEVEL_TO_TYPE_MAP } = await importMap()

		const values = Object.values(LOG_LEVEL_TO_TYPE_MAP)
		const len = 7

		for (const v of values) expect(v.length).toBe(len)
	})

	it('styling maps should return ANSI-wrapped strings', async () => {
		const { LOG_LEVEL_TO_TYPE_COLOR_MAP, LOG_LEVEL_TO_COLOR_MAP, LOG_LEVEL_TO_BACKGROUND_COLOR_MAP }
			= await importMap()

		const sample = 'Hello'

		const colored = LOG_LEVEL_TO_COLOR_MAP[LogLevel.WARNING](sample)
		expect(colored).toContain(sample)
		// eslint-disable-next-line no-control-regex
		expect(colored).toMatch(/^\u001B\[\d+m/u)
		// eslint-disable-next-line no-control-regex
		expect(colored).toMatch(/\u001B\[\d+m$/u)

		const typeColored = LOG_LEVEL_TO_TYPE_COLOR_MAP[LogLevel.ERROR](sample)
		expect(typeColored).toContain(sample)
		expect(typeColored).toContain('\u001B[')

		const bg = LOG_LEVEL_TO_BACKGROUND_COLOR_MAP[LogLevel.FATAL](sample)
		expect(bg).toContain(sample)
		expect(bg).toContain('\u001B[')
	})
})
