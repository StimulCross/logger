import { inspect, type InspectOptions } from 'node:util';
import { isColorSupported, process } from 'std-env';
import { BaseLogger } from './base-logger.js';
import { DEFAULT_OPTIONS } from '../constants.js';
import { type LogLevel } from '../enums/log-level.js';
import { type LoggerOptions } from '../interfaces/logger-options.js';
import { createAccentWrapper } from '../utils/common-wrappers.js';
import { getMinLogLevelFromEnv } from '../utils/get-min-log-level-from-env.js';
import {
	logLevelToColor,
	logLevelToConsoleFunction,
	logLevelToType,
	logLevelToTypeColor,
} from '../utils/log-level-map.js';
import { resolveLogLevel } from '../utils/resolve-log-level.js';

/** @internal */
export abstract class ConsoleRuntimeLogger extends BaseLogger {
	protected override _minLevel: LogLevel;
	protected readonly _inspectOptions?: InspectOptions;
	protected readonly _pid?: boolean;
	protected readonly _colors?: boolean;

	constructor(options: LoggerOptions) {
		super(options);

		this._minLevel =
			options.minLevel === undefined
				? (getMinLogLevelFromEnv(this._options.context) ?? DEFAULT_OPTIONS.minLevel)
				: resolveLogLevel(options.minLevel);

		this._pid = options.pid ?? true;
		this._colors = this._options.colors && isColorSupported;

		this._inspectOptions = {
			depth: 5,
			colors: this._colors,
			...options.inspectOptions,
		};
	}

	public log(level: LogLevel, ...args: unknown[]): void {
		if (!this._shouldLog(level)) {
			return;
		}

		const logFn = logLevelToConsoleFunction[level];
		const parts: unknown[] = [];

		const { applicationName, pid, timestamps, context } = this._options;

		// [app]
		if (applicationName) {
			const t = `[${applicationName}]`;
			parts.push(this._colors ? logLevelToColor[level](t) : t);
		}

		// PID
		if (pid && process.pid !== undefined) {
			const pidStr = String(process.pid);
			parts.push(this._colors ? logLevelToColor[level](pidStr) : pidStr);
		}

		// timestamp
		if (timestamps) {
			const now = new Date();
			const timestamp = this._dateTimeFormatter
				? this._dateTimeFormatter(now)
				: now.toLocaleString(this._dateTimeFormatOptions?.locale, this._dateTimeFormatOptions);

			parts.push(this._colors ? logLevelToColor[level](' -') : ' -', timestamp);
		}

		// TYPE/LEVEL
		parts.push('  ', this._colors ? logLevelToTypeColor[level](logLevelToType[level]) : logLevelToType[level]);

		// [context]
		const ctx = `[${context}]`;
		parts.push(this._colors ? createAccentWrapper(ctx) : ctx);

		// arguments
		for (const arg of args) {
			if (arg instanceof Error) {
				parts.push(this._formatError(arg, level));
			} else if (typeof arg === 'string') {
				parts.push(this._colors ? logLevelToColor[level](arg) : arg);
			} else if (typeof arg === 'object' && arg !== null) {
				parts.push(this._inspectOptions ? inspect(arg, this._inspectOptions) : arg);
			} else {
				parts.push(arg);
			}
		}

		// time diff
		const timeDiff = this._getTimeDiff();

		if (timeDiff) {
			parts.push(this._colors ? createAccentWrapper(timeDiff) : timeDiff);
		}

		logFn(...parts);
	}

	protected abstract _formatError(error: Error, level: LogLevel): unknown;
}
