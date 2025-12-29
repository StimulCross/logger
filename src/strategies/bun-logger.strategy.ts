import { ConsoleRuntimeLogger } from './console-runtime-logger.js';
import { type LoggerOptions } from '../interfaces/logger-options.js';

/** @internal */
export class BunLoggerStrategy extends ConsoleRuntimeLogger {
	protected _formatError(error: Error): unknown {
		return error;
	}

	protected override _createChildLogger(options: LoggerOptions): BunLoggerStrategy {
		return new BunLoggerStrategy(options);
	}
}
