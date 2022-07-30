import type { WriteStream } from 'tty';
import type { LogLevel } from './LogLevel';
import { LogLevelToConsoleFunction } from './LogLevel';
import { BaseLogger, COLORED_TYPES, COLORS, TYPES } from './BaseLogger';

const localeStringOptions = {
	year: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
	day: '2-digit',
	month: '2-digit'
};

export class NodeLogger extends BaseLogger {
	log(level: LogLevel, ...args: unknown[]): void {
		if (level > this._minLevel) {
			return;
		}

		const logFn = LogLevelToConsoleFunction[level];

		let builtMessage = '';

		const useColors = this._colors && ((process.stdout as WriteStream | undefined)?.isTTY ?? true);

		if (this._applicationName) {
			builtMessage += `[${this._applicationName}] `;
		}

		if (this._pid) {
			builtMessage += `${process.pid}  - `;
		}

		if (this._timestamps) {
			// @ts-ignore
			const timestamp = `${new Date().toLocaleString(localeStringOptions)}    `;
			builtMessage += useColors ? COLORS.WHITE(timestamp) : timestamp;
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

		builtMessage += useColors ? `${COLORED_TYPES[level]} ` : `${TYPES[level]} `;

		const context = `[${this._context}] `;
		builtMessage += useColors ? COLORS.ACCENT(context) : context;

		builtMessage += message;

		if (this._timeDiff) {
			builtMessage += BaseLogger._updateAndGetTimestampDiff();
		}

		if (useColors) {
			builtMessage = BaseLogger._wrapWithColor(level, builtMessage);
		}

		logFn(builtMessage);
	}
}
