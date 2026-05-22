import type { LoggerOptions } from '../../common/interfaces/logger-options.js'
import { DenoFormatter } from '../formatters/deno-formatter.js'
import { ConsoleRuntimeLogger } from './console-runtime-logger.js'

/** @internal */
export class DenoLoggerStrategy extends ConsoleRuntimeLogger {
	protected override _formatter = new DenoFormatter(this._options)

	protected override _createChildLogger(options: LoggerOptions): DenoLoggerStrategy {
		return new DenoLoggerStrategy(options)
	}
}
