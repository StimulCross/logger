import { ConsoleRuntimeLogger } from './console-runtime-logger.js';
import { type LogLevel } from '../enums/log-level.js';
import { logLevelToColor } from '../utils/log-level-map.js';
import { createBgWrapper, createColorWrapper, createModifierWrapper } from '../utils/styling-function.js';

const createErrorWrapper = createBgWrapper('bgRed', createColorWrapper('whiteBright', createModifierWrapper('bold')));

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
}
