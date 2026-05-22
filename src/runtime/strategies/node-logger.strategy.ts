import type { LoggerOptions } from '../../common/interfaces/logger-options.js'
import { NodeFormatter } from '../formatters/node-formatter.js'
import { ConsoleRuntimeLogger } from './console-runtime-logger.js'

/** @internal */
export class NodeLoggerStrategy extends ConsoleRuntimeLogger {
	protected override _formatter = new NodeFormatter(this._options)

	protected override _createChildLogger(options: LoggerOptions): NodeLoggerStrategy {
		return new NodeLoggerStrategy(options)
	}
}
