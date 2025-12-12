import { BaseLogger } from './base-logger.js';
import { DEFAULT_OPTIONS } from '../constants.js';
import { type LogLevel } from '../enums/log-level.js';
import { type LoggerOptions } from '../interfaces/logger-options.js';
import {
	logLevelToColor,
	logLevelToConsoleFunction,
	logLevelToType,
	logLevelToTypeColor,
} from '../utils/log-level-map.js';
import { resolveLogLevel } from '../utils/resolve-log-level.js';
import { createColorWrapper } from '../utils/styling-function.js';

const createAccentWrapper = createColorWrapper('yellowBright');

/** @internal */
export class BrowserLoggerStrategy extends BaseLogger {
	protected override _minLevel: LogLevel;

	constructor(options: LoggerOptions) {
		super(options);

		this._minLevel = options.minLevel ? resolveLogLevel(options.minLevel) : DEFAULT_OPTIONS.minLevel;
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = logLevelToConsoleFunction[level];
		const shouldUseColors = this._colors;
		const templateArgs: string[] = [];
		const messageArgs: unknown[] = [];

		if (this._applicationName) {
			templateArgs.push(shouldUseColors ? logLevelToColor[level]('%s') : '%s');
			messageArgs.push(`[${this._applicationName}]`);
		}

		if (this._timestamps) {
			templateArgs.push('%s');
			messageArgs.push(`${new Date().toLocaleString(undefined, this._dateTimeFormatOptions)}   `);
		}

		templateArgs.push(shouldUseColors ? logLevelToTypeColor[level]('%s') : '%s');
		messageArgs.push(logLevelToType[level]);

		templateArgs.push(shouldUseColors ? createAccentWrapper('%s') : '%s');
		messageArgs.push(`[${this._context}]`);

		for (const arg of args) {
			if (typeof arg === 'object') {
				templateArgs.push('%o');
			} else {
				templateArgs.push(shouldUseColors ? logLevelToColor[level]('%s') : '%s');
			}

			messageArgs.push(arg);
		}

		const timeDiff = this._getTimeDiff();

		if (timeDiff) {
			templateArgs.push(shouldUseColors ? createAccentWrapper('%s') : '%s');
			messageArgs.push(timeDiff);
		}

		logFn(templateArgs.join(' '), ...messageArgs);
	}
}
