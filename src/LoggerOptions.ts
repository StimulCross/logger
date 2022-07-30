import type { LoggerOverride } from './CustomLoggerWrapper';
import type { LogLevel } from './LogLevel';

export interface LoggerOptions {
	applicationName?: string;
	context: string;
	minLevel?: LogLevel | keyof typeof LogLevel | string;
	pid?: boolean;
	colors?: boolean;
	timestamps?: boolean;
	custom?: LoggerOverride;
	prettifyObjects?: boolean;
	timeDiff?: boolean;
}
