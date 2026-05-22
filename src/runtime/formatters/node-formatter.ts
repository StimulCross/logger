import type { StackFrame } from 'error-stack-parser'
import type { LogEntry } from '../../common/interfaces/log-entry.js'
import type { ColorVariant } from '../../common/types/color-variant.js'
import errorStackParser from 'error-stack-parser'
import { colorize, colorizeError, colorizeWithGray } from '../../common/utils/colorize.js'
import { createColorWrapper, createModifierWrapper } from '../../common/utils/styling-function.js'
import { RuntimeFormatter } from './runtime-formatter.js'

const stackFrameWrapper = createColorWrapper('cyan', createModifierWrapper('bold', createModifierWrapper('italic')))
const stackFrameBrightWrapper = createColorWrapper(
	'cyanBright',
	createModifierWrapper('bold', createModifierWrapper('italic')),
)

function colorizeStackFrame(str: string, color: ColorVariant): string {
	return color === 'bright' ? stackFrameBrightWrapper(str) : stackFrameWrapper(str)
}

/** @internal */
export class NodeFormatter extends RuntimeFormatter {
	protected override _formatError(error: Error, { level }: LogEntry): string {
		if (!this._colors)
			return error.stack ?? `${error.name}: ${error.message}`

		const stackLines: string[] = [
			`${colorizeError(` ${error.name} `, this._colors)} ${colorize(error.message, level, this._colors)}`,
		]

		const frames = errorStackParser.parse(error)

		for (const frame of frames) {
			const stackLine = this._formatStackFrame(frame)
			stackLines.push(stackLine)
		}

		return stackLines.join('\n')
	}

	private _formatStackFrame({
		functionName = '<anonymous>',
		fileName,
		lineNumber,
		columnNumber,
	}: StackFrame): string {
		const result: string[] = [`    ${colorizeWithGray('at', this._colors)}`]

		if (functionName) {
			result.push(
				fileName && (fileName.includes('node_modules') || fileName.startsWith('node:'))
					? `${colorizeWithGray(functionName, this._colors)}`
					: `${colorizeStackFrame(functionName, this._colors!)}`,
			)
		}

		if (fileName) {
			let path = fileName

			if (lineNumber !== undefined)
				path += `:${lineNumber}`

			if (columnNumber !== undefined)
				path += `:${columnNumber}`

			path = `(${path})`
			result.push(path)
		}

		return result.join(' ')
	}
}
