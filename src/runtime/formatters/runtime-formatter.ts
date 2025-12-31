import { inspect } from 'node:util';
import { isColorSupported, process } from 'std-env';
import { LogFormatter } from '../../common/formatters/log-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { type LoggerOptions } from '../../common/interfaces/logger-options.js';
import { createAccentWrapper, createGrayWrapper } from '../../common/utils/common-wrappers.js';
import {
	LOG_LEVEL_TO_COLOR_MAP,
	LOG_LEVEL_TO_TYPE_COLOR_MAP,
	LOG_LEVEL_TO_TYPE_MAP,
} from '../../common/utils/log-level-map.js';

/** @internal */
export class RuntimeFormatter extends LogFormatter {
	private readonly _inspectOptions?: Parameters<typeof inspect>[1];
	private readonly _pid?: boolean;
	protected readonly _colors?: boolean;

	constructor(options: LoggerOptions) {
		super(options);

		this._pid = options.pid ?? true;
		this._colors = this._options.colors && isColorSupported;

		this._inspectOptions = {
			depth: 5,
			colors: this._colors,
			...options.inspectOptions,
		};
	}

	public formatToParts(entry: LogEntry): unknown[] {
		const { level, args, timestamp, timeDiff, timeDiffScope } = entry;
		const { applicationName, timestamps, context } = this._options;

		const parts: unknown[] = [];

		if (applicationName) {
			const t = `[${applicationName}]`;
			parts.push(this._colors ? LOG_LEVEL_TO_COLOR_MAP[level](t) : t);
		}

		if (this._pid && process.pid !== undefined) {
			const pidStr = String(process.pid);
			parts.push(this._colors ? LOG_LEVEL_TO_COLOR_MAP[level](pidStr) : pidStr);
		}

		if (timestamps) {
			const date = new Date(timestamp);
			const dateStr = this._dateTimeFormatter
				? this._dateTimeFormatter(date)
				: date.toLocaleString(this._dateTimeFormatOptions?.locale, this._dateTimeFormatOptions);

			parts.push(this._colors ? LOG_LEVEL_TO_COLOR_MAP[level](' -') : ' -', dateStr);
		}

		parts.push(
			'  ',
			this._colors
				? LOG_LEVEL_TO_TYPE_COLOR_MAP[level](LOG_LEVEL_TO_TYPE_MAP[level])
				: LOG_LEVEL_TO_TYPE_MAP[level],
		);

		const ctx = `[${context}]`;
		parts.push(this._colors ? createAccentWrapper(ctx) : ctx);

		for (const arg of args) {
			if (arg instanceof Error) {
				parts.push(this._formatError(arg, entry));
			} else if (typeof arg === 'string') {
				parts.push(this._colors ? LOG_LEVEL_TO_COLOR_MAP[level](arg) : arg);
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
				parts.push(createAccentWrapper(diff), createGrayWrapper(scope));
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
