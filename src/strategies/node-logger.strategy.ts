import { type WriteStream } from 'tty';
import { BaseLogger } from './base-logger.js';
import { type LogLevel } from '../enums/log-level.js';
import {
	logLevelToColor,
	logLevelToConsoleFunction,
	logLevelToType,
	logLevelToTypeColor,
} from '../utils/log-level-map.js';
import { safeStringify } from '../utils/safe-stringify.js';
import { createColorWrapper } from '../utils/styling-function.js';

/** @internal */
export class NodeLoggerStrategy extends BaseLogger {
	private readonly _accentColorWrapper = createColorWrapper('yellowBright');

	public log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = logLevelToConsoleFunction[level];

		let builtMessage = '';

		const shouldUseColors = this._colors && ((process.stdout as WriteStream | undefined)?.isTTY ?? true);

		if (this._applicationName) {
			const applicationName = `[${this._applicationName}] `;
			builtMessage += shouldUseColors ? logLevelToColor[level](applicationName) : applicationName;
		}

		if (this._pid) {
			const pid = `${process.pid}  - `;
			builtMessage += shouldUseColors ? logLevelToColor[level](pid) : pid;
		}

		if (this._timestamps) {
			const timestamp = `${new Date().toLocaleString(undefined, this._dateTimeFormatOptions)}    `;
			builtMessage += timestamp;
		}

		const message = args
			.map((arg: unknown) => {
				if (arg instanceof Error) {
					return arg.stack ? `${arg.stack}\n` : `${arg.name}${arg.message ? `: ${arg.message}` : ''}`;
				}

				if (typeof arg === 'object' && arg !== null) {
					if (this._prettifyObjects) {
						return `${Object.prototype.toString.call(arg)}:\n${safeStringify(arg, 2)}\n`;
					}

					return safeStringify(arg);
				}

				return String(arg);
			})
			.join(' ');

		builtMessage += shouldUseColors
			? `${logLevelToTypeColor[level](logLevelToType[level])} `
			: `${logLevelToType[level]} `;

		const context = `[${this._context}] `;
		builtMessage += shouldUseColors ? this._accentColorWrapper(context) : context;

		builtMessage += shouldUseColors ? logLevelToColor[level](message) : message;

		if (this._timeDiff) {
			const timeDiff = BaseLogger._updateAndGetTimestampDiff();
			builtMessage += shouldUseColors ? this._accentColorWrapper(timeDiff) : timeDiff;
		}

		logFn(builtMessage);
	}
}
