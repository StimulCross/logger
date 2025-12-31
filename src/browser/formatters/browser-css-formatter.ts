import { LogFormatter } from '../../common/formatters/log-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { LOG_LEVEL_TO_TYPE_MAP } from '../../common/utils/log-level-map.js';
import {
	ACCENT_COLOR,
	GRAY_COLOR,
	LOG_LEVEL_TO_COLOR_MAP,
	LOG_LEVEL_TO_TYPE_COLOR_MAP,
	MODIFIER_STYLES,
} from '../utils/css-styling.js';

// Browsers that are not based on Chromium do not support ANSI styling.
/** @internal */
export class BrowserCssFormatter extends LogFormatter {
	public formatToParts(entry: LogEntry): unknown[] {
		const { level, args, timestamp, timeDiff, timeDiffScope } = entry;
		const { applicationName, timestamps, context, colors } = this._options;

		const templateArgs: string[] = [];
		const messageArgs: unknown[] = [];

		if (applicationName) {
			if (colors) {
				templateArgs.push('%c%s%c');
				messageArgs.push(LOG_LEVEL_TO_COLOR_MAP[level], `[${applicationName}]`, MODIFIER_STYLES.reset);
			} else {
				templateArgs.push('%s');
				messageArgs.push(`[${applicationName}]`);
			}
		}

		if (timestamps) {
			const date = new Date(timestamp);
			const dateStr = this._dateTimeFormatter
				? this._dateTimeFormatter(date)
				: date.toLocaleString(this._dateTimeFormatOptions?.locale, this._dateTimeFormatOptions);

			templateArgs.push('%s');
			messageArgs.push(`${dateStr}   `);
		}

		if (colors) {
			templateArgs.push('%c%s%c');
			messageArgs.push(LOG_LEVEL_TO_TYPE_COLOR_MAP[level], LOG_LEVEL_TO_TYPE_MAP[level], MODIFIER_STYLES.reset);

			templateArgs.push('%c%s');
			messageArgs.push(ACCENT_COLOR, `[${context}]`);
		} else {
			templateArgs.push('%s');
			messageArgs.push(LOG_LEVEL_TO_TYPE_MAP[level]);

			templateArgs.push('%s');
			messageArgs.push(`[${context}]`);
		}

		for (const arg of args) {
			if (typeof arg === 'string') {
				if (colors) {
					templateArgs.push('%c%s');
					messageArgs.push(LOG_LEVEL_TO_COLOR_MAP[level], arg);
				} else {
					templateArgs.push('%s');
					messageArgs.push(arg);
				}
			} else {
				templateArgs.push('%o');
				messageArgs.push(arg);
			}
		}

		if (this._options.timeDiff) {
			const timeDiffStr = `+${timeDiff}ms`;
			const scopeStr = timeDiffScope === 'global' ? '[G]' : '[L]';

			if (colors) {
				templateArgs.push('%c%s', '%c%s');
				messageArgs.push(ACCENT_COLOR, timeDiffStr, GRAY_COLOR, scopeStr);
			} else {
				templateArgs.push('%s', '%s');
				messageArgs.push(timeDiffStr, scopeStr);
			}
		}

		return [templateArgs.join(' '), ...messageArgs];
	}
}
