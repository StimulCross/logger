import { BaseLogger } from './base-logger.js';
import { DEFAULT_OPTIONS } from '../constants.js';
import { type LogLevel } from '../enums/log-level.js';
import { type LoggerOptions } from '../interfaces/logger-options.js';
import { createAccentWrapper, createGrayWrapper } from '../utils/common-wrappers.js';
import {
	logLevelToColor,
	logLevelToConsoleFunction,
	logLevelToType,
	logLevelToTypeColor,
} from '../utils/log-level-map.js';
import { resolveLogLevel } from '../utils/resolve-log-level.js';

/** @internal */
export class BrowserLoggerStrategy extends BaseLogger {
	protected override _minLevel: LogLevel;

	constructor(options: LoggerOptions) {
		super(options);

		this._minLevel = options.minLevel === undefined ? DEFAULT_OPTIONS.minLevel : resolveLogLevel(options.minLevel);
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		if (!this._shouldLog(level)) {
			return;
		}

		const { applicationName, timestamps, context, colors } = this._options;

		const logFn = logLevelToConsoleFunction[level];
		const templateArgs: string[] = [];
		const messageArgs: unknown[] = [];

		if (applicationName) {
			templateArgs.push(colors ? logLevelToColor[level]('%s') : '%s');
			messageArgs.push(`[${applicationName}]`);
		}

		if (timestamps) {
			templateArgs.push('%s');
			messageArgs.push(`${new Date().toLocaleString(undefined, this._dateTimeFormatOptions)}   `);
		}

		templateArgs.push(colors ? logLevelToTypeColor[level]('%s') : '%s');
		messageArgs.push(logLevelToType[level]);

		templateArgs.push(colors ? createAccentWrapper('%s') : '%s');
		messageArgs.push(`[${context}]`);

		for (const arg of args) {
			if (typeof arg === 'object') {
				templateArgs.push('%o');
			} else {
				templateArgs.push(colors ? logLevelToColor[level]('%s') : '%s');
			}

			messageArgs.push(arg);
		}

		if (this._options.timeDiff) {
			if (colors) {
				templateArgs.push(createAccentWrapper('%s'), createGrayWrapper('%s'));
			} else {
				templateArgs.push('%s', '%s');
			}

			messageArgs.push(`+${this._getTimeDiff()}ms`, this._options.timeDiff === 'global' ? '[G]' : '[L]');
		}

		logFn(templateArgs.join(' '), ...messageArgs);
	}

	protected override _createChildLogger(options: LoggerOptions): BrowserLoggerStrategy {
		return new BrowserLoggerStrategy(options);
	}
}
