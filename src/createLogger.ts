import isNode from 'detect-node';
import { BrowserLogger } from './BrowserLogger';
import { CustomLoggerWrapper } from './CustomLoggerWrapper';
import type { Logger } from './Logger';
import type { LoggerOptions } from './LoggerOptions';
import { NodeLogger } from './NodeLogger';

/**
 * Creates a logger instance depending on the current environment.
 *
 * @param options The logger options.
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
