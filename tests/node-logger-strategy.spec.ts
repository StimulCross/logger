import type { LoggerOptions } from '../src/common/interfaces/logger-options.js'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LogLevel } from '../src/common/enums/log-level.js'

const { createLoggerMock } = vi.hoisted(() => ({
	createLoggerMock: vi.fn(),
}))

vi.mock('error-stack-parser', () => ({
	default: {
		parse: vi.fn(() => [
			{ functionName: 'fn', fileName: '/app/src/a.ts', lineNumber: 10, columnNumber: 20 },
			{ functionName: 'lib', fileName: '/app/node_modules/x/index.js', lineNumber: 1, columnNumber: 2 },
			{ functionName: 'fs', fileName: 'node:fs', lineNumber: undefined, columnNumber: undefined },
			{ functionName: '', fileName: '/app/src/b.ts', lineNumber: undefined, columnNumber: undefined },
			{ functionName: 'noFile' },
		]),
	},
}))

describe('nodeLoggerStrategy', () => {
	let errorFn: ReturnType<typeof vi.fn<(...args: unknown[]) => void>>
	let originalErrorFn: ((...args: unknown[]) => void) | undefined

	async function setup() {
		vi.resetModules()

		vi.doMock('../src/create-logger.js', () => ({
			createLogger: createLoggerMock,
		}))

		const map = await import('../src/common/utils/log-level-map.js')
		originalErrorFn = map.LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.ERROR]

		errorFn = vi.fn<(...args: unknown[]) => void>()
		map.LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.ERROR] = errorFn

		const { NodeLoggerStrategy } = await import('../src/runtime/strategies/node-logger.strategy.js')

		return { NodeLoggerStrategy }
	}

	async function createLogger(opts: Partial<LoggerOptions> = {}) {
		const { NodeLoggerStrategy } = await setup()

		return new NodeLoggerStrategy({
			context: 'CTX',
			applicationName: 'APP',
			minLevel: LogLevel.TRACE,
			colors: false,
			timestamps: false,
			timeDiff: undefined,
			pid: true,
			...opts,
		})
	}

	afterEach(async () => {
		const map = await import('../src/common/utils/log-level-map.js')

		if (originalErrorFn)
			map.LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP[LogLevel.ERROR] = originalErrorFn

		vi.doUnmock('../src/create-logger.js')
		vi.doUnmock('std-env')
		vi.restoreAllMocks()
	})

	it('should not log when below minLevel', async () => {
		const logger = await createLogger({
			context: 'CTX',
			minLevel: LogLevel.FATAL,
			colors: false,
			timestamps: false,
			timeDiff: undefined,
		})

		logger.log(LogLevel.ERROR, 'nope')
		expect(errorFn).not.toHaveBeenCalled()
	})

	it('should include app/pid/context/type and format args (string/object/primitive)', async () => {
		const logger = await createLogger({ colors: false, timestamps: false, pid: true })
		logger.log(LogLevel.ERROR, 'msg', { a: 1 }, 123)

		expect(errorFn).toHaveBeenCalledTimes(1)

		const asStr = errorFn.mock.calls[0].map(v => String(v)).join(' ')
		expect(asStr).toContain('[APP]')
		expect(asStr).toContain(String(process.pid))
		expect(asStr).toContain('ERROR')
		expect(asStr).toContain('[CTX]')
		expect(asStr).toContain('msg')
		expect(asStr).toContain('{ a: 1 }')
		expect(asStr).toContain('123')
	})

	it('should omit pid when pid=false', async () => {
		const logger = await createLogger({ pid: false, colors: false, timestamps: false })
		logger.log(LogLevel.ERROR, 'x')

		expect(errorFn).toHaveBeenCalledTimes(1)
		const asStr = errorFn.mock.calls[0].map(v => String(v)).join(' ')
		expect(asStr).not.toContain(String(process.pid))
	})

	it('should include timestamp and use dateTimeFormatter when provided', async () => {
		const formatter = vi.fn(() => '[TS]')

		const logger = await createLogger({
			timestamps: true,
			dateTimeFormat: formatter,
			colors: false,
		})

		logger.log(LogLevel.ERROR, 'x')

		expect(errorFn).toHaveBeenCalledTimes(1)
		expect(formatter).toHaveBeenCalledTimes(1)

		const asStr = errorFn.mock.calls[0].map(v => String(v)).join(' ')
		expect(asStr).toContain('[TS]')
	})

	it('should append timeDiff when enabled', async () => {
		const nowSpy = vi.spyOn(Date, 'now')
		nowSpy.mockReturnValue(1000)

		const logger = await createLogger({ timeDiff: 'local', colors: false })

		logger.log(LogLevel.ERROR, 'first')
		nowSpy.mockReturnValue(1150)
		logger.log(LogLevel.ERROR, 'second')

		expect(errorFn).toHaveBeenCalledTimes(2)

		const diff = errorFn.mock.calls[1].at(-2)
		const scope = errorFn.mock.calls[1].at(-1)

		expect(diff).toMatch(/\+\d+ms/u)
		expect(scope).toMatch(/\[L\]/u)
	})

	it('should format Error differently based on colors flag', async () => {
		const loggerNoColors = await createLogger({ colors: false })
		const e1 = new Error('boom')
		e1.stack = undefined

		loggerNoColors.log(LogLevel.ERROR, e1)

		expect(errorFn).toHaveBeenCalledTimes(1)
		const s1 = errorFn.mock.calls[0].map(v => String(v)).join(' ')
		expect(s1).toContain('Error: boom')

		vi.resetModules()

		vi.doMock('std-env', async () => {
			const actual = await vi.importActual<any>('std-env')

			return { ...actual, isColorSupported: true }
		})

		const loggerColors = await createLogger({ colors: true })
		errorFn.mockClear()

		const e2 = new Error('boom2')
		loggerColors.log(LogLevel.ERROR, e2)

		expect(errorFn).toHaveBeenCalledTimes(1)
		const s2 = errorFn.mock.calls[0].map(v => String(v)).join('\n')
		expect(s2).toContain('boom2')
		expect(s2).toContain('\u001B[')
		expect(s2).toContain('at')
	})
})
