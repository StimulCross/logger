import { LogFormatter } from '../../common/formatters/log-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { createAccentWrapper, createGrayWrapper } from '../../common/utils/common-wrappers.js';
import {
	LOG_LEVEL_TO_COLOR_MAP,
	LOG_LEVEL_TO_TYPE_MAP,
	LOG_LEVEL_TO_TYPE_COLOR_MAP,
} from '../../common/utils/log-level-map.js';

/** @internal */
export class BrowserAnsiFormatter extends LogFormatter {
	public formatToParts(entry: LogEntry): unknown[] {
		const { level, args, timestamp, timeDiff, timeDiffScope } = entry;
		const { applicationName, timestamps, context, colors } = this._options;

		const templateArgs: string[] = [];
		const messageArgs: unknown[] = [];

		if (applicationName) {
			templateArgs.push(colors ? LOG_LEVEL_TO_COLOR_MAP[level]('%s') : '%s');
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

		templateArgs.push(colors ? LOG_LEVEL_TO_TYPE_COLOR_MAP[level]('%s') : '%s');
		messageArgs.push(LOG_LEVEL_TO_TYPE_MAP[level]);

		templateArgs.push(colors ? createAccentWrapper('%s') : '%s');
		messageArgs.push(`[${context}]`);

		for (const arg of args) {
			if (typeof arg === 'string') {
				if (colors) {
					templateArgs.push(LOG_LEVEL_TO_COLOR_MAP[level]('%s'));
				} else {
					templateArgs.push('%s');
				}
			} else {
				templateArgs.push('%o');
			}

			messageArgs.push(arg);
		}

		if (this._options.timeDiff) {
			if (colors) {
				templateArgs.push(createAccentWrapper('%s'), createGrayWrapper('%s'));
			} else {
				templateArgs.push('%s', '%s');
			}

			messageArgs.push(`+${timeDiff}ms`, timeDiffScope === 'global' ? '[G]' : '[L]');
		}

		return [templateArgs.join(' '), ...messageArgs];
	}
}
