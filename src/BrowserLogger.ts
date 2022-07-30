import type { LogLevel } from './LogLevel';
import { LogLevelToConsoleFunction } from './LogLevel';
import { BaseLogger } from './BaseLogger';

export class BrowserLogger extends BaseLogger {
	log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = LogLevelToConsoleFunction[level];
		let builtMessage: string = `[${this._context}]`;

		const message = args.map((arg: unknown) => String(arg)).join(' ');
		builtMessage += message;

		if (this._timeDiff) {
			builtMessage += BaseLogger._updateAndGetTimestampDiff(false);
		}

		logFn(builtMessage);
	}
}
