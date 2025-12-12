import { ConsoleRuntimeLogger } from './console-runtime-logger.js';

/** @internal */
export class BunLoggerStrategy extends ConsoleRuntimeLogger {
	protected _formatError(error: Error): unknown {
		return error;
	}
}
