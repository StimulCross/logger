import isNode from 'detect-node';
import { type Logger } from './interfaces/logger';
import { type LoggerOptions } from './interfaces/logger-options';
import { BrowserLogger } from './strategies/browser-logger';
import { CustomLoggerWrapper } from './strategies/custom-logger-wrapper';
import { NodeLogger } from './strategies/node-logger';

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
		return new CustomLoggerWrapper(options);
	}

	if (isNode) {
		return new NodeLogger(options);
	}
	return new BrowserLogger(options);
}
