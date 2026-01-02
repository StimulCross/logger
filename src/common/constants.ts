import { LogLevel } from './enums/log-level.js';
import { type LoggerOptions } from './interfaces/logger-options.js';

export const DEFAULT_OPTIONS = {
	minLevel: LogLevel.SUCCESS,
	colors: 'standard',
	pid: true,
	timestamps: true,
	dateTimeFormat: {
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		day: '2-digit',
		month: '2-digit',
		fractionalSecondDigits: 3,
		hour12: false,
	},
	inspectOptions: { depth: 5 },
} as const satisfies Partial<LoggerOptions>;
