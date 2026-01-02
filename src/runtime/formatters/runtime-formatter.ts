import { inspect } from 'node:util';
import { isColorSupported, process } from 'std-env';
import { LogFormatter } from '../../common/formatters/log-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { type LoggerOptions } from '../../common/interfaces/logger-options.js';
import { type ColorVariant } from '../../common/types/color-variant.js';
import { colorize, colorizeType, colorizeWithAccent, colorizeWithGray } from '../../common/utils/colorize.js';
import { LOG_LEVEL_TO_TYPE_MAP } from '../../common/utils/log-level-map.js';

/** @internal */
export class RuntimeFormatter extends LogFormatter {
	private readonly _inspectOptions?: Parameters<typeof inspect>[1];
	private readonly _pid?: boolean;
	protected readonly _colors?: ColorVariant;

	constructor(options: LoggerOptions) {
		super(options);

		this._pid = options.pid ?? true;

		if (isColorSupported && this._options.colors) {
			this._colors = typeof this._options.colors === 'boolean' ? 'standard' : this._options.colors;
		}

		this._inspectOptions = {
			depth: 5,
			...options.inspectOptions,
			colors: Boolean(this._options.colors),
		};
	}

	public formatToParts(entry: LogEntry): unknown[] {
		const { level, args, timestamp, timeDiff, timeDiffScope } = entry;
		const { applicationName, timestamps, context } = this._options;

		const parts: unknown[] = [];

		if (applicationName) {
			const appNameStr = `[${applicationName}]`;
			parts.push(colorize(appNameStr, level, this._colors));
		}

		if (this._pid && process.pid !== undefined) {
			const pidStr = String(process.pid);
			parts.push(colorize(pidStr, level, this._colors));
		}

		if (timestamps) {
			const date = new Date(timestamp);
			const dateStr = this._dateTimeFormatter
				? this._dateTimeFormatter(date)
				: date.toLocaleString(this._dateTimeFormatOptions?.locale, this._dateTimeFormatOptions);

			parts.push(colorize(' -', level, this._colors), dateStr);
		}

		parts.push('  ', colorizeType(LOG_LEVEL_TO_TYPE_MAP[level], level, this._colors));

		const ctx = `[${context}]`;
		parts.push(colorizeWithAccent(ctx, this._colors));

		for (const arg of args) {
			if (arg instanceof Error) {
				parts.push(this._formatError(arg, entry));
			} else if (typeof arg === 'string') {
				parts.push(colorize(arg, level, this._colors));
			} else if (typeof arg === 'object' && arg !== null) {
				parts.push(this._inspectOptions ? inspect(arg, this._inspectOptions) : arg);
			} else {
				parts.push(arg);
			}
		}

		if (this._options.timeDiff) {
			const diff = `+${timeDiff}ms`;
			const scope = timeDiffScope === 'global' ? '[G]' : '[L]';

			if (this._colors) {
				parts.push(colorizeWithAccent(diff, this._colors), colorizeWithGray(scope, this._colors));
			} else {
				parts.push(diff, scope);
			}
		}

		return parts;
	}

	protected _formatError(error: Error, _entry: LogEntry): unknown {
		return error;
	}
}
