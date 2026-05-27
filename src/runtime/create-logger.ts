import type { LoggerOptions } from '../common/interfaces/logger-options.js'
import type { Logger } from '../common/interfaces/logger.js'
import { CustomLoggerStrategy } from '../common/strategies/custom-logger.strategy.js'
import { BunLoggerStrategy } from './strategies/bun-logger.strategy.js'
import { DenoLoggerStrategy } from './strategies/deno-logger.strategy.js'
import { NodeLoggerStrategy } from './strategies/node-logger.strategy.js'
import { detectRuntime, Runtime } from './utils/detect-runtime.js'

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
export function createLogger(options: LoggerOptions): Logger
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
export function createLogger(context: string, options?: Omit<LoggerOptions, 'context'>): Logger
export function createLogger(
	contextOrOptions: string | LoggerOptions,
	options?: Omit<LoggerOptions, 'context'>,
): Logger {
	const opts = typeof contextOrOptions === 'string' ? { ...options, context: contextOrOptions } : contextOrOptions

	if (opts.custom)
		return new CustomLoggerStrategy(opts)

	const runtime = detectRuntime()

	switch (runtime) {
		case Runtime.Bun:
			return new BunLoggerStrategy(opts)

		case Runtime.Deno:
			return new DenoLoggerStrategy(opts)

		default:
			return new NodeLoggerStrategy(opts)
	}
}
