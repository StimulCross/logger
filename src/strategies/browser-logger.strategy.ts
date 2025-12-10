import { BaseLogger } from './base-logger.js';
import { type LogLevel } from '../enums/log-level.js';
import {
	logLevelToColor,
	logLevelToConsoleFunction,
	logLevelToType,
	logLevelToTypeColor,
} from '../utils/log-level-map.js';
import { createColorWrapper } from '../utils/styling-function.js';

/** @internal */
export class BrowserLoggerStrategy extends BaseLogger {
	private readonly _accentColorWrapper = createColorWrapper('yellowBright');

	public log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = logLevelToConsoleFunction[level];

		const shouldUseColors = this._colors;
		const templateArgs: string[] = [];
		const arrArgs: unknown[] = [];

		if (this._applicationName) {
			templateArgs.push(shouldUseColors ? logLevelToColor[level]('%s') : '%s');
			arrArgs.push(`[${this._applicationName}]`);
		}

		if (this._timestamps) {
			templateArgs.push('%s');
			arrArgs.push(`${new Date().toLocaleString(undefined, this._dateTimeFormatOptions)}   `);
		}

		templateArgs.push(shouldUseColors ? logLevelToTypeColor[level]('%s') : '%s');
		arrArgs.push(logLevelToType[level]);

		templateArgs.push(shouldUseColors ? this._accentColorWrapper('%s') : '%s');
		arrArgs.push(`[${this._context}]`);

		for (const arg of args) {
			if (typeof arg === 'object') {
				templateArgs.push('%o');
			} else {
				templateArgs.push(shouldUseColors ? logLevelToColor[level]('%s') : '%s');
			}

			arrArgs.push(arg);
		}

		if (this._timeDiff) {
			templateArgs.push(shouldUseColors ? this._accentColorWrapper('%s') : '%s');
			arrArgs.push(BaseLogger._updateAndGetTimestampDiff());
		}

		logFn(templateArgs.join(' '), ...arrArgs);
	}
}
