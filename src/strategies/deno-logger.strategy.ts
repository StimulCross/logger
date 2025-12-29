import { ConsoleRuntimeLogger } from './console-runtime-logger.js';
import { type LogLevel } from '../enums/log-level.js';
import { type LoggerOptions } from '../interfaces/logger-options.js';
import { createErrorWrapper } from '../utils/common-wrappers.js';
import { logLevelToColor } from '../utils/log-level-map.js';

/** @internal */
export class DenoLoggerStrategy extends ConsoleRuntimeLogger {
	protected _formatError(error: Error, level: LogLevel): string {
		if (!this._colors) {
			return error.stack ?? `${error.name}: ${error.message}`;
		}

		const lines: string[] = [`${createErrorWrapper(` ${error.name} `)} ${logLevelToColor[level](error.message)}`];

		if (error.stack) {
			lines.push(error.stack);
		}

		return lines.join('\n');
	}

	protected override _createChildLogger(options: LoggerOptions): DenoLoggerStrategy {
		return new DenoLoggerStrategy(options);
	}
}
