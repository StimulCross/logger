import { LogFormatter } from '../../common/formatters/log-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { type ColorVariant } from '../../common/types/color-variant.js';
import { colorize, colorizeType, colorizeWithAccent, colorizeWithGray } from '../../common/utils/colorize.js';
import { LOG_LEVEL_TO_TYPE_MAP } from '../../common/utils/log-level-map.js';
import { type BrowserLoggerOptions } from '../interfaces/browser-logger-options.js';

/** @internal */
export class BrowserAnsiFormatter extends LogFormatter {
	private readonly _colors?: ColorVariant;

	constructor(options: BrowserLoggerOptions) {
		super(options);

		this._colors = typeof options.colors === 'boolean' ? 'standard' : options.colors;
	}

	public formatToParts(entry: LogEntry): unknown[] {
		const { level, args, timestamp, timeDiff, timeDiffScope } = entry;
		const { applicationName, timestamps, context } = this._options;

		const templateArgs: string[] = [];
		const messageArgs: unknown[] = [];

		if (applicationName) {
			templateArgs.push(colorize('%s', level, this._colors));
			messageArgs.push(`[${applicationName}]`);
		}

		if (timestamps) {
			const date = new Date(timestamp);
			const dateStr = this._dateTimeFormatter
				? this._dateTimeFormatter(date)
				: date.toLocaleString(this._dateTimeFormatOptions?.locale, this._dateTimeFormatOptions);

			templateArgs.push('%s');
			messageArgs.push(`${dateStr}   `);
		}

		templateArgs.push(colorizeType('%s', level, this._colors));
		messageArgs.push(LOG_LEVEL_TO_TYPE_MAP[level]);

		templateArgs.push(colorizeWithAccent('%s', this._colors));
		messageArgs.push(`[${context}]`);

		for (const arg of args) {
			if (typeof arg === 'string') {
				templateArgs.push(colorize('%s', level, this._colors));
			} else {
				templateArgs.push('%o');
			}

			messageArgs.push(arg);
		}

		if (this._options.timeDiff) {
			templateArgs.push(colorizeWithAccent('%s', this._colors), colorizeWithGray('%s', this._colors));
			messageArgs.push(`+${timeDiff}ms`, timeDiffScope === 'global' ? '[G]' : '[L]');
		}

		return [templateArgs.join(' '), ...messageArgs];
	}
}
