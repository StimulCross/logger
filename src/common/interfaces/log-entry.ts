import { type LogLevel } from '../enums/log-level.js';
import { type LoggerTimeDiffScope } from '../types/logger-time-diff-scope.js';

export interface LogEntry {
	level: LogLevel;
	context: string;
	timestamp: number;
	args: unknown[];
	appName?: string;
	pid?: number;
	timeDiff: number;
	timeDiffScope: LoggerTimeDiffScope;
}
