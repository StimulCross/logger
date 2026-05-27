import { createLogger, LoggerRuntime, LogLevel } from '../lib/runtime/index.js'
import { detectRuntime } from '../lib/runtime/utils/detect-runtime.js'

function sep(title) {
	console.log(`\n${'-'.repeat(5)} ${title} ${'-'.repeat(20)}\n`)
}

const runtime = (detectRuntime() ?? 'UNKNOWN').toUpperCase()

sep(`DEMO FOR ${runtime} RUNTIME`)

// 0. DEFAULT MIN LEVEL DEMO (DEFAULT = SUCCESS)
sep('DEFAULT MIN LEVEL = SUCCESS')

const loggerDefault = createLogger('DefaultDemo', {})

loggerDefault.info('INFO — should NOT appear')
loggerDefault.debug('DEBUG — should NOT appear')
loggerDefault.trace('TRACE — should NOT appear')
loggerDefault.success('SUCCESS — visible')
loggerDefault.warn('WARNING — visible')
loggerDefault.error('ERROR — visible')

// 1. BASIC LOGGER (explicit minLevel = TRACE to show everything)
sep('BASIC LOGGER (minLevel = TRACE)')

const logger1 = createLogger('BasicDemo', {
	applicationName: 'MyApp',
	minLevel: LogLevel.TRACE,
})

logger1.fatal('Fatal message')
logger1.error('Error message')
logger1.warn('Warning message')
logger1.success('Success message')
logger1.info('Info message')
logger1.debug('Debug message')
logger1.trace('Trace message')
logger1.info('Logging multiple values:', 42, true, null, { key: 'value' })

// 2. MIN LEVEL = INFO
sep('MIN LEVEL = INFO')

const logger2 = createLogger('LevelDemo', {
	minLevel: LogLevel.INFO,
})

logger2.trace('TRACE — should NOT appear')
logger2.debug('DEBUG — should NOT appear')
logger2.info('INFO — should appear')
logger2.info('INFO with object:', { user: 'john', id: 12 })
logger2.success('SUCCESS — should appear')
logger2.warn('WARN — should appear')
logger2.error('ERROR — should appear')

// 3. CUSTOM TIMESTAMP FORMATTING
sep('CUSTOM TIMESTAMP FORMATTER (function)')

const logger3 = createLogger('DateDemo', {
	minLevel: LogLevel.INFO,
	dateTimeFormat: d => d.toISOString(),
})

logger3.info('ISO timestamp formatting example')
logger3.success('Boot completed')
logger3.warn('Not optimal performance detected')

sep('CUSTOM TIMESTAMP OPTIONS (locale + formatting options)')

const logger4 = createLogger('DateDemo2', {
	minLevel: LogLevel.INFO,
	dateTimeFormat: {
		locale: 'en-US',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	},
})

logger4.info('US timestamp formatting example')
logger4.success('Operation successful with custom time format')
logger4.error('Something happened, but with US timestamp')

// 4. DISABLE COLORS + DISABLE TIMESTAMPS
sep('NO COLORS, NO TIMESTAMPS')

const logger5 = createLogger('PlainDemo', {
	minLevel: LogLevel.INFO,
	colors: false,
	timestamps: false,
})

logger5.info('This log has no colors and no timestamps')
logger5.success('Plain success message')
logger5.error('Plain error message')
logger5.debug('DEBUG — should NOT appear at INFO level')

// 5. TIME DIFF MEASUREMENT
sep('TIME DIFF MEASUREMENT')

const logger6 = createLogger('TimedDemo', {
	minLevel: LogLevel.INFO,
	timeDiff: 'local',
})

logger6.info('Start step 1')

setTimeout(() => {
	logger6.info('Step 2 after delay')
	logger6.success('Completed sub-step under delay')

	setTimeout(() => {
		logger6.warn('Step 3 after another delay')
		logger6.info('End of timed chain')
	}, 300)
}, 500)

// 6. COMPLEX OBJECTS + INSPECT OPTIONS
sep('OBJECT LOGGING + INSPECT OPTIONS')

const cyclic = { a: 1 }
cyclic.self = cyclic // cyclic reference

const deepObject = {
	level1: {
		level2: {
			level3: [1, { nested: 'value', arr: [10, 20, 30] }, () => 'function in object'],
		},
	},
	users: [
		{ id: 1, name: 'Alice' },
		{ id: 2, name: 'Bob', roles: ['admin', 'editor'] },
	],
}

const logger7 = createLogger('InspectDemo', {
	minLevel: LogLevel.DEBUG,
	inspectOptions: { depth: 10, colors: true, showHidden: true },
})

logger7.success(
	'Map example:',
	new Map([
		[1, true],
		['test', false],
	]),
)

logger7.info('Nested object example:', deepObject)
logger7.debug('Cyclic object example:', cyclic)
logger7.debug('Array with mixed types:', [1, 'text', { foo: 123 }, [9, 8, 7]])

// 7. ERROR LOGGING
sep('ERROR LOGGING')

const logger8 = createLogger('ErrorDemo', { minLevel: LogLevel.INFO })

try {
	throw new TypeError('Something went wrong')
}
catch (err) {
	logger8.error('Caught error:', err)
}

function faultyFunc() {
	throw new ReferenceError('Error inside nested function call')
}

try {
	faultyFunc()
}
catch (err) {
	logger8.error('Stack example from nested function:', err)
}

// 8. CUSTOM LOGGER OVERRIDE
sep('CUSTOM LOGGER OVERRIDE')

const customLogger = createLogger({
	context: 'CustomDemo',
	minLevel: LogLevel.INFO,
	custom: (level, ...args) => {
		console.log(`[CUSTOM:${LogLevel[level]}]`, ...args)
	},
})

customLogger.info('Custom override example')
customLogger.warn('Custom warning')
customLogger.error('Custom override error')
customLogger.success('Custom success')

// 9. FULL CONFIGURATION
sep('FULL CONFIGURATION')

const logger9 = createLogger('FullDemo', {
	applicationName: 'MegaService',
	minLevel: LogLevel.TRACE,
	colors: true,
	pid: true,
	timestamps: true,
	timeDiff: 'global',
	dateTimeFormat: {
		locale: 'en-GB',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	},
})

logger9.trace('Trace details')
logger9.debug('Debug data:', { x: 10, y: 20 })
logger9.info('System is operational')
logger9.success('Operation successful')
logger9.warn('Potential issue detected')
logger9.error(new RangeError('Full configuration test error'))
logger9.info('Multiple mixed args:', 123, false, { cfg: true }, ['a', 'b', 'c'])

// 10. BRIGHT COLORS
sep('BRIGHT COLORS')

const logger10 = createLogger('BasicDemo', {
	applicationName: 'MyApp',
	minLevel: LogLevel.TRACE,
	colors: 'bright',
})

logger10.fatal(new RangeError('Fatal message'))
logger10.error('Error message')
logger10.warn('Warning message')
logger10.success('Success message')
logger10.info('Info message')
logger10.debug('Debug message')
logger10.trace('Trace message')
logger10.info('Logging multiple values:', 42, true, null, { key: 'value' })

// 11. OBSERVING
sep('OBSERVING')
const logger11 = createLogger('ObserveDemo', { applicationName: 'ObserverApp', minLevel: LogLevel.INFO })

const logObserver = async entry => console.log('Received log event:', entry)
const unsubscribe = LoggerRuntime.subscribe(logObserver)

logger11.info('Log event test', true, 1, null, { foo: 'bar' })
unsubscribe()

// 12. LAZY LOGGING (Deferred Evaluation)
sep('LAZY LOGGING')

const logger12 = createLogger('LazyDemo', { minLevel: LogLevel.INFO })

let expensiveOperationsCount = 0

logger12.info('Attempting to log a heavy DEBUG message (minLevel is INFO)...')

// This will not be executed (I hope)
logger12.lazy.debug(() => {
	expensiveOperationsCount++
	const heavyPayload = Array.from({ length: 100_000 }).fill('data').join(',')

	return ['Heavy debug payload:', heavyPayload]
})

logger12.info('Attempting to log a heavy INFO message...')

// This will be executed
logger12.lazy.info(() => {
	expensiveOperationsCount++

	return ['Lazy info payload executed successfully.']
})

logger12.success(`Total expensive operations actually executed: ${expensiveOperationsCount} (Expected: 1)`)

// END
sep(`DEMO FOR ${runtime} COMPLETED`)
