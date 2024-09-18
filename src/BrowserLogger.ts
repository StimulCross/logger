import { BaseLogger } from './BaseLogger';
import type { LogLevel } from './LogLevel';
import { LogLevelToColor, LogLevelToConsoleFunction, LogLevelToType, LogLevelToTypeColor } from './utils/LogLevelMap';
import { createColorWrapper } from './utils/StylingFunction';

/** @internal */
export class BrowserLogger extends BaseLogger {
	private readonly _accentColorWrapper = createColorWrapper('yellowBright');

	log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = LogLevelToConsoleFunction[level];

		const useColors = this._colors;
		const templateArgs: string[] = [];
		const arrArgs: unknown[] = [];

		if (this._applicationName) {
			templateArgs.push(useColors ? LogLevelToColor[level]('%s') : '%s');
			arrArgs.push(`[${this._applicationName}]`);
		}

		if (this._timestamps) {
			templateArgs.push('%s');
			arrArgs.push(`${new Date().toLocaleString(undefined, this._dateTimeFormatOptions)}   `);
		}

		templateArgs.push(useColors ? LogLevelToTypeColor[level]('%s') : '%s');
		arrArgs.push(LogLevelToType[level]);

		templateArgs.push(useColors ? this._accentColorWrapper('%s') : '%s');
		arrArgs.push(`[${this._context}]`);

		args.forEach((arg: unknown) => {
			if (typeof arg === 'object') {
				templateArgs.push('%o');
			} else {
				templateArgs.push(useColors ? LogLevelToColor[level]('%s') : '%s');
			}

			arrArgs.push(arg);
		});

		if (this._timeDiff) {
			templateArgs.push(useColors ? this._accentColorWrapper('%s') : '%s');
			arrArgs.push(BaseLogger._updateAndGetTimestampDiff());
		}

		logFn(templateArgs.join(' '), ...arrArgs);
	}
}
