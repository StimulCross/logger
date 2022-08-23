import isNode from 'detect-node';
import { BrowserLogger } from './BrowserLogger';
import { CustomLoggerWrapper } from './CustomLoggerWrapper';
import type { Logger } from './Logger';
import type { LoggerOptions } from './LoggerOptions';
import { NodeLogger } from './NodeLogger';

export function createLogger(options: LoggerOptions): Logger {
	if (options.custom) {
		return new CustomLoggerWrapper(options);
	}

	if (isNode) {
		return new NodeLogger(options);
	}
	return new BrowserLogger(options);
}
