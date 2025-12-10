import isNode from 'detect-node';
import { type LoggerOptions } from './interfaces/logger-options.js';
import { type Logger } from './interfaces/logger.js';
import { BrowserLoggerStrategy } from './strategies/browser-logger.strategy.js';
import { CustomLoggerStrategy } from './strategies/custom-logger.strategy.js';
import { NodeLoggerStrategy } from './strategies/node-logger.strategy.js';

/**
 * Creates a logger instance appropriate for the current runtime environment.
 *
 * Depending on whether the code is executed in Node.js, a browser, or another
 * supported environment, this function returns the corresponding logger
 * implementation.
 *
 * @param options Configuration options for the logger.
 * @returns A logger instance tailored to the detected environment.
 */
export function createLogger(options: LoggerOptions): Logger {
	if (options.custom) {
		return new CustomLoggerStrategy(options);
	}

	if (isNode) {
		return new NodeLoggerStrategy(options);
	}

	return new BrowserLoggerStrategy(options);
}
