import { process } from 'std-env';
import { BaseLogger } from '../../common/base-logger.js';
import { DEFAULT_OPTIONS } from '../../common/constants.js';
import { type LogLevel } from '../../common/enums/log-level.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { type LoggerInspectOptions } from '../../common/interfaces/logger-inspect-options.js';
import { type LoggerOptions } from '../../common/interfaces/logger-options.js';
import { resolveLogLevel } from '../../common/utils/resolve-log-level.js';
import { getMinLogLevelFromEnv } from '../utils/get-min-log-level-from-env.js';

/** @internal */
export abstract class ConsoleRuntimeLogger extends BaseLogger {
	protected override _minLevel: LogLevel;
	protected readonly _inspectOptions?: LoggerInspectOptions;
	protected readonly _pid?: boolean;

	constructor(options: LoggerOptions) {
		super(options);

		this._minLevel =
			options.minLevel === undefined
				? (getMinLogLevelFromEnv(this._options.context) ?? DEFAULT_OPTIONS.minLevel)
				: resolveLogLevel(options.minLevel);

		this._pid = options.pid ?? true;

		this._inspectOptions = {
			depth: 5,
			...options.inspectOptions,
			colors: Boolean(this._options.colors),
		};
	}

	protected override _createLogEntry(level: LogLevel, args: unknown[]): LogEntry {
		return {
			level,
			context: this._options.context,
			timestamp: Date.now(),
			args,
			appName: this._options.applicationName,
			pid: process.pid,
			timeDiff: this._getTimeDiff(),
			timeDiffScope: this._options.timeDiff ?? 'global',
		};
	}
}
