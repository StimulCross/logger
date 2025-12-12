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
export const logLevelToConsoleFunction: LogLevelMap<(...args: unknown[]) => void> = {
	[LogLevel.FATAL]: console.error.bind(console),
	[LogLevel.ERROR]: console.error.bind(console),
	[LogLevel.WARNING]: console.warn.bind(console),
	[LogLevel.SUCCESS]: console.info.bind(console),
	[LogLevel.INFO]: console.info.bind(console),
	[LogLevel.DEBUG]: console.debug.bind(console),
	[LogLevel.TRACE]: console.trace.bind(console),
};

/** @internal */
export const logLevelToType = {
	[LogLevel.FATAL]: ' FATAL ',
	[LogLevel.ERROR]: 'ERROR  ',
	[LogLevel.WARNING]: 'WARNING',
	[LogLevel.SUCCESS]: 'SUCCESS',
	[LogLevel.INFO]: 'INFO   ',
	[LogLevel.DEBUG]: 'DEBUG  ',
	[LogLevel.TRACE]: 'TRACE  ',
};

/** @internal */
export const logLevelToTypeColor: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createBgWrapper('bgRed', createColorWrapper('whiteBright', createModifierWrapper('bold'))),
	[LogLevel.ERROR]: createColorWrapper('redBright', createModifierWrapper('bold')),
	[LogLevel.WARNING]: createColorWrapper('yellowBright', createModifierWrapper('bold')),
	[LogLevel.SUCCESS]: createColorWrapper('greenBright', createModifierWrapper('bold')),
	[LogLevel.INFO]: createColorWrapper('blueBright', createModifierWrapper('bold')),
	[LogLevel.DEBUG]: createColorWrapper('magentaBright', createModifierWrapper('bold')),
	[LogLevel.TRACE]: createColorWrapper('cyanBright', createModifierWrapper('bold')),
};

/** @internal */
export const logLevelToColor: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createColorWrapper('redBright'),
	[LogLevel.ERROR]: createColorWrapper('redBright'),
	[LogLevel.WARNING]: createColorWrapper('yellowBright'),
	[LogLevel.SUCCESS]: createColorWrapper('greenBright'),
	[LogLevel.INFO]: createColorWrapper('blueBright'),
	[LogLevel.DEBUG]: createColorWrapper('magentaBright'),
	[LogLevel.TRACE]: createColorWrapper('cyanBright'),
};

/** @internal */
export const logLevelToBackgroundColor: LogLevelMap<StylingFunction> = {
	[LogLevel.FATAL]: createBgWrapper('bgRed', createColorWrapper('white')),
	[LogLevel.ERROR]: createBgWrapper('bgRedBright', createColorWrapper('white')),
	[LogLevel.WARNING]: createBgWrapper('bgYellow', createColorWrapper('black')),
	[LogLevel.SUCCESS]: createColorWrapper('green'),
	[LogLevel.INFO]: createBgWrapper('bgBlue', createColorWrapper('white')),
	[LogLevel.DEBUG]: createBgWrapper('bgMagenta', createColorWrapper('black')),
	[LogLevel.TRACE]: createBgWrapper('bgCyanBright', createColorWrapper('black')),
};
