import { type LoggerOptions } from '../../common/interfaces/logger-options.js';

/**
 * An options object for the browser logger.
 */
export type BrowserLoggerOptions = Omit<LoggerOptions, 'pid' | 'inspectOptions'>;
