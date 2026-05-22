import type { Logger } from '../common/interfaces/logger.js'
import type { BrowserLoggerOptions } from './interfaces/browser-logger-options.js'
import { CustomLoggerStrategy } from '../common/strategies/custom-logger.strategy.js'
import { BrowserLoggerStrategy } from './strategies/browser-logger.strategy.js'

/**
 * Creates a logger instance appropriate for the current runtime environment.
 *
 * Depending on whether the code is executed in Node.js, a browser, or another
 * supported environment, this function returns the corresponding logger
 * implementation.
 *
 * @param options Logger configuration options.
 *
 * @returns A logger instance tailored to the detected environment.
 */
export function createLogger(options: BrowserLoggerOptions): Logger
/**
 * Creates a logger instance appropriate for the current runtime environment.
 *
 * Depending on whether the code is executed in Node.js, a browser, or another
 * supported environment, this function returns the corresponding logger
 * implementation.
 *
 * @param context The context label to apply.
 * @param options Logger configuration options.
 *
 * @returns A logger instance tailored to the detected environment.
 */
export function createLogger(context: string, options?: Omit<BrowserLoggerOptions, 'context'>): Logger
export function createLogger(
	contextOrOptions: string | BrowserLoggerOptions,
	options?: Omit<BrowserLoggerOptions, 'context'>,
): Logger {
	const opts = typeof contextOrOptions === 'string' ? { ...options, context: contextOrOptions } : contextOrOptions

	if (opts.custom)
		return new CustomLoggerStrategy(opts)

	return new BrowserLoggerStrategy(opts)
}
