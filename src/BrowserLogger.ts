import type { LogLevel } from './LogLevel';
import { LogLevelToConsoleFunction } from './LogLevel';
import { BaseLogger } from './BaseLogger';

export class BrowserLogger extends BaseLogger {
	log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = LogLevelToConsoleFunction[level];

		logFn(`[${this._context}]`, ...args);
	}
}
