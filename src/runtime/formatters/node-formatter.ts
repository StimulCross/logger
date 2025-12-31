import errorStackParser, { type StackFrame } from 'error-stack-parser';
import { RuntimeFormatter } from './runtime-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { createErrorWrapper, createGrayWrapper } from '../../common/utils/common-wrappers.js';
import { LOG_LEVEL_TO_COLOR_MAP } from '../../common/utils/log-level-map.js';
import { createColorWrapper, createModifierWrapper } from '../../common/utils/styling-function.js';

const createWhiteWrapper = createColorWrapper('white');
const createStackFrameWrapper = createColorWrapper(
	'cyan',
	createModifierWrapper('bold', createModifierWrapper('italic')),
);

/** @internal */
export class NodeFormatter extends RuntimeFormatter {
	protected override _formatError(error: Error, { level }: LogEntry): string {
		if (!this._colors) {
			return error.stack ?? `${error.name}: ${error.message}`;
		}

		const stackLines: string[] = [
			`${createErrorWrapper(` ${error.name} `)} ${LOG_LEVEL_TO_COLOR_MAP[level](error.message)}`,
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
		const result: string[] = [`    ${createGrayWrapper('at')}`];

		if (functionName) {
			result.push(
				fileName && (fileName.includes('node_modules') || fileName.startsWith('node:'))
					? `${createGrayWrapper(functionName)}`
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
