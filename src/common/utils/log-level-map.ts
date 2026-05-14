/* eslint-disable no-console */
import {
	createBgWrapper,
	createColorWrapper,
	createModifierWrapper,
	type StylingFunction,
} from './styling-function.js';
import { LogLevel } from '../enums/log-level.js';

/** @internal */
export type LogLevelMap<T> = { [severity in LogLevel]: T };

/** @internal */
export const LOG_LEVEL_TO_CONSOLE_FUNCTION_MAP: LogLevelMap<(...args: unknown[]) => void> = {
	[LogLevel.FATAL]: console.error.bind(console),
	[LogLevel.ERROR]: console.error.bind(console),
	[LogLevel.WARNING]: console.warn.bind(console),
	[LogLevel.SUCCESS]: console.info.bind(console),
	[LogLevel.INFO]: console.info.bind(console),
	[LogLevel.DEBUG]: console.debug.bind(console),
	[LogLevel.VERBOSE]: console.debug.bind(console),
	[LogLevel.TRACE]: console.trace.bind(console),
};

/** @internal */
export const LOG_LEVEL_TO_TYPE_MAP = {
	[LogLevel.FATAL]: ' FATAL ',
	[LogLevel.ERROR]: 'ERROR  ',
	[LogLevel.WARNING]: 'WARNING',
	[LogLevel.SUCCESS]: 'SUCCESS',
	[LogLevel.INFO]: 'INFO   ',
	[LogLevel.DEBUG]: 'DEBUG  ',
	[LogLevel.VERBOSE]: 'VERBOSE',
	[LogLevel.TRACE]: 'TRACE  ',
};

/** @internal */
export const LOG_LEVEL_TO_TYPE_COLOR_MAP: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createBgWrapper('bgRed', createColorWrapper('whiteBright', createModifierWrapper('bold'))),
	[LogLevel.ERROR]: createColorWrapper('red', createModifierWrapper('bold')),
	[LogLevel.WARNING]: createColorWrapper('yellow', createModifierWrapper('bold')),
	[LogLevel.SUCCESS]: createColorWrapper('green', createModifierWrapper('bold')),
	[LogLevel.INFO]: createColorWrapper('blue', createModifierWrapper('bold')),
	[LogLevel.DEBUG]: createColorWrapper('magenta', createModifierWrapper('bold')),
	[LogLevel.VERBOSE]: createColorWrapper('cyan', createModifierWrapper('bold')),
	[LogLevel.TRACE]: createColorWrapper('cyan', createModifierWrapper('bold')),
};

/** @internal */
export const LOG_LEVEL_TO_TYPE_BRIGHT_COLOR_MAP: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createBgWrapper('bgRedBright', createColorWrapper('black', createModifierWrapper('bold'))),
	[LogLevel.ERROR]: createColorWrapper('redBright', createModifierWrapper('bold')),
	[LogLevel.WARNING]: createColorWrapper('yellowBright', createModifierWrapper('bold')),
	[LogLevel.SUCCESS]: createColorWrapper('greenBright', createModifierWrapper('bold')),
	[LogLevel.INFO]: createColorWrapper('blueBright', createModifierWrapper('bold')),
	[LogLevel.DEBUG]: createColorWrapper('magentaBright', createModifierWrapper('bold')),
	[LogLevel.VERBOSE]: createColorWrapper('cyanBright', createModifierWrapper('bold')),
	[LogLevel.TRACE]: createColorWrapper('cyanBright', createModifierWrapper('bold')),
};

/** @internal */
export const LOG_LEVEL_TO_COLOR_MAP: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createColorWrapper('red'),
	[LogLevel.ERROR]: createColorWrapper('red'),
	[LogLevel.WARNING]: createColorWrapper('yellow'),
	[LogLevel.SUCCESS]: createColorWrapper('green'),
	[LogLevel.INFO]: createColorWrapper('blue'),
	[LogLevel.DEBUG]: createColorWrapper('magenta'),
	[LogLevel.VERBOSE]: createColorWrapper('cyan'),
	[LogLevel.TRACE]: createColorWrapper('cyan'),
};

/** @internal */
export const LOG_LEVEL_TO_BRIGHT_COLOR_MAP: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createColorWrapper('redBright'),
	[LogLevel.ERROR]: createColorWrapper('redBright'),
	[LogLevel.WARNING]: createColorWrapper('yellowBright'),
	[LogLevel.SUCCESS]: createColorWrapper('greenBright'),
	[LogLevel.INFO]: createColorWrapper('blueBright'),
	[LogLevel.DEBUG]: createColorWrapper('magentaBright'),
	[LogLevel.VERBOSE]: createColorWrapper('cyanBright'),
	[LogLevel.TRACE]: createColorWrapper('cyanBright'),
};

/** @internal */
export const LOG_LEVEL_TO_BACKGROUND_COLOR_MAP: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createBgWrapper('bgRed', createColorWrapper('whiteBright', createModifierWrapper('bold'))),
	[LogLevel.ERROR]: createBgWrapper('bgRed', createColorWrapper('whiteBright', createModifierWrapper('bold'))),
	[LogLevel.WARNING]: createBgWrapper('bgYellow', createColorWrapper('black', createModifierWrapper('bold'))),
	[LogLevel.SUCCESS]: createBgWrapper('bgGreen', createColorWrapper('whiteBright', createModifierWrapper('bold'))),
	[LogLevel.INFO]: createBgWrapper('bgBlue', createColorWrapper('whiteBright', createModifierWrapper('bold'))),
	[LogLevel.DEBUG]: createBgWrapper('bgMagenta', createColorWrapper('black', createModifierWrapper('bold'))),
	[LogLevel.VERBOSE]: createBgWrapper('bgCyan', createColorWrapper('black', createModifierWrapper('bold'))),
	[LogLevel.TRACE]: createBgWrapper('bgCyan', createColorWrapper('black', createModifierWrapper('bold'))),
};
