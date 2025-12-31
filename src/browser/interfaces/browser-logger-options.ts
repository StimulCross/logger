import { type LoggerOptions } from '../../common/interfaces/logger-options.js';

export type BrowserLoggerOptions = Omit<LoggerOptions, 'pid' | 'inspectOptions'>;
