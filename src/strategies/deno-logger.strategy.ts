import { ConsoleRuntimeLogger } from './console-runtime-logger.js';

/** @internal */
export class DenoLoggerStrategy extends ConsoleRuntimeLogger {
	protected _formatError(error: Error): unknown {
		return error;
	}
}
