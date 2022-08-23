import type { LogLevel } from './LogLevel';
import { BaseLogger } from './BaseLogger';
import { LogLevelToConsoleFunction } from './utils/LogLevelMap';

export class BrowserLogger extends BaseLogger {
	log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = LogLevelToConsoleFunction[level];
		let builtMessage = `[${this._context}]`;

		const message = args.map((arg: unknown) => String(arg)).join(' ');
		builtMessage += message;

		if (this._timeDiff) {
			builtMessage += BaseLogger._updateAndGetTimestampDiff();
		}

		logFn(builtMessage);
	}
}
