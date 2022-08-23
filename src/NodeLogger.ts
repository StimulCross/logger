import type { WriteStream } from 'tty';
import type { LogLevel } from './LogLevel';
import { BaseLogger } from './BaseLogger';
import { createColorWrapper } from './utils/StylingFunction';
import { LogLevelToColor, LogLevelToConsoleFunction, LogLevelToType, LogLevelToTypeColor } from './utils/LogLevelMap';

/** @internal */
export class NodeLogger extends BaseLogger {
	private readonly _accentColorWrapper = createColorWrapper('yellowBright');

	log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = LogLevelToConsoleFunction[level];

		let builtMessage = '';

		const useColors = this._colors && ((process.stdout as WriteStream | undefined)?.isTTY ?? true);

		if (this._applicationName) {
			const applicationName = `[${this._applicationName}] `;
			builtMessage += useColors ? LogLevelToColor[level](applicationName) : applicationName;
		}

		if (this._pid) {
			const pid = `${process.pid}  - `;
			builtMessage += useColors ? LogLevelToColor[level](pid) : pid;
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
						return `${Object.prototype.toString.call(arg)}:\n${JSON.stringify(arg, null, 2)}\n`;
					}

					return JSON.stringify(arg);
				}

				return String(arg);
			})
			.join(' ');

		builtMessage += useColors
			? `${LogLevelToTypeColor[level](LogLevelToType[level])} `
			: `${LogLevelToType[level]} `;

		const context = `[${this._context}] `;
		builtMessage += useColors ? this._accentColorWrapper(context) : context;

		builtMessage += useColors ? LogLevelToColor[level](message) : message;

		if (this._timeDiff) {
			const timeDiff = BaseLogger._updateAndGetTimestampDiff();
			builtMessage += useColors ? this._accentColorWrapper(timeDiff) : timeDiff;
		}

		logFn(builtMessage);
	}
}
