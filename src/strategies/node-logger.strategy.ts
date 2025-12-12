import errorStackParser, { type StackFrame } from 'error-stack-parser';
import { ConsoleRuntimeLogger } from './console-runtime-logger.js';
import { type LogLevel } from '../enums/log-level.js';
import { logLevelToColor } from '../utils/log-level-map.js';
import { createBgWrapper, createColorWrapper, createModifierWrapper } from '../utils/styling-function.js';

const createWhiteWrapper = createColorWrapper('white');
const creatGrayWrapper = createColorWrapper('blackBright');
const createErrorWrapper = createBgWrapper('bgRed', createColorWrapper('whiteBright', createModifierWrapper('bold')));
const createStackFrameWrapper = createColorWrapper(
	'cyan',
	createModifierWrapper('bold', createModifierWrapper('italic')),
);

/** @internal */
export class NodeLoggerStrategy extends ConsoleRuntimeLogger {
	protected _formatError(error: Error, level: LogLevel): string {
		if (!this._colors) {
			return error.stack ?? `${error.name}: ${error.message}`;
		}

		const stackLines: string[] = [
			`${createErrorWrapper(` ${error.name} `)} ${logLevelToColor[level](error.message)}`,
		];

		const frames = errorStackParser.parse(error);

		for (const frame of frames) {
			const stackLine = this._formatStackFrame(frame);
			stackLines.push(stackLine);
		}

		return stackLines.join('\n');
	}

	private _formatStackFrame({
		functionName = '<anonymous>',
		fileName,
		lineNumber,
		columnNumber,
	}: StackFrame): string {
		const result: string[] = [`    ${creatGrayWrapper('at')}`];

		if (functionName) {
			result.push(
				fileName && (fileName.includes('node_modules') || fileName.startsWith('node:'))
					? `${creatGrayWrapper(functionName)}`
					: `${createStackFrameWrapper(functionName)}`,
			);
		}

		if (fileName) {
			let path = fileName;

			if (lineNumber !== undefined) {
				path += `:${lineNumber}`;
			}

			if (columnNumber !== undefined) {
				path += `:${columnNumber}`;
			}

			path = createWhiteWrapper(`(${path})`);
			result.push(path);
		}

		return result.join(' ');
	}
}
