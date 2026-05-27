import type { LogLevel } from '../enums/log-level.js'
import type { ColorVariant } from '../types/color-variant.js'
import {
	LOG_LEVEL_TO_BRIGHT_COLOR_MAP,
	LOG_LEVEL_TO_COLOR_MAP,
	LOG_LEVEL_TO_TYPE_BRIGHT_COLOR_MAP,
	LOG_LEVEL_TO_TYPE_COLOR_MAP,
} from './log-level-map.js'
import { createBgWrapper, createColorWrapper, createModifierWrapper } from './styling-function.js'

const accentWrapper = createColorWrapper('yellow')
const accentBrightWrapper = createColorWrapper('yellowBright')
const grayWrapper = createColorWrapper('blackBright')
const errorWrapper = createBgWrapper('bgRed', createColorWrapper('whiteBright', createModifierWrapper('bold')))
const errorWrapperBright = createBgWrapper('bgRedBright', createColorWrapper('black', createModifierWrapper('bold')))

/** @internal */
export function colorize(str: string, level: LogLevel, color?: ColorVariant): string {
	return color
		? color === 'bright'
			? LOG_LEVEL_TO_BRIGHT_COLOR_MAP[level](str)
			: LOG_LEVEL_TO_COLOR_MAP[level](str)
		: str
}

/** @internal */
export function colorizeType(str: string, level: LogLevel, color?: ColorVariant): string {
	return color
		? color === 'bright'
			? LOG_LEVEL_TO_TYPE_BRIGHT_COLOR_MAP[level](str)
			: LOG_LEVEL_TO_TYPE_COLOR_MAP[level](str)
		: str
}

/** @internal */
export function colorizeWithAccent(str: string, color?: ColorVariant): string {
	return color ? color === 'bright' ? accentBrightWrapper(str) : accentWrapper(str) : str
}

/** @internal */
export const colorizeWithGray = (str: string, color?: ColorVariant): string => color ? grayWrapper(str) : str

/** @internal */
export function colorizeError(str: string, color?: ColorVariant): string {
	return color ? color === 'bright' ? errorWrapperBright(str) : errorWrapper(str) : str
}
