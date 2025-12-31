import { ConsoleRuntimeLogger } from './console-runtime-logger.js';
import { type LoggerOptions } from '../../common/interfaces/logger-options.js';
import { RuntimeFormatter } from '../formatters/runtime-formatter.js';

/** @internal */
export class BunLoggerStrategy extends ConsoleRuntimeLogger {
	protected override _formatter = new RuntimeFormatter(this._options);

	protected override _createChildLogger(options: LoggerOptions): BunLoggerStrategy {
		return new BunLoggerStrategy(options);
	}
}
