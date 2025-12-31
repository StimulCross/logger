import { BaseLogger } from '../../common/base-logger.js';
import { DEFAULT_OPTIONS } from '../../common/constants.js';
import { type LogLevel } from '../../common/enums/log-level.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { type LoggerOptions } from '../../common/interfaces/logger-options.js';
import { resolveLogLevel } from '../../common/utils/resolve-log-level.js';
import { BrowserAnsiFormatter } from '../formatters/browser-ansi-formatter.js';
import { BrowserCssFormatter } from '../formatters/browser-css-formatter.js';
import { isChromium } from '../utils/is-chromium.js';

/** @internal */
export class BrowserLoggerStrategy extends BaseLogger {
	protected override _minLevel: LogLevel;
	protected override _formatter = isChromium
		? new BrowserAnsiFormatter(this._options)
		: new BrowserCssFormatter(this._options);

	constructor(options: LoggerOptions) {
		super(options);

		this._minLevel = options.minLevel === undefined ? DEFAULT_OPTIONS.minLevel : resolveLogLevel(options.minLevel);
	}

	protected override _createChildLogger(options: LoggerOptions): BrowserLoggerStrategy {
		return new BrowserLoggerStrategy(options);
	}

	protected override _createLogEntry(level: LogLevel, args: unknown[]): LogEntry {
		return {
			level,
			context: this._options.context,
			timestamp: Date.now(),
			args,
			appName: this._options.applicationName,
			timeDiff: this._getTimeDiff(),
			timeDiffScope: this._options.timeDiff ?? 'global',
		};
	}
}
