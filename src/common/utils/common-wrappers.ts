import { createBgWrapper, createColorWrapper, createModifierWrapper } from './styling-function.js';

/** @internal */
export const createAccentWrapper = createColorWrapper('yellow');

/** @internal */
export const createGrayWrapper = createColorWrapper('blackBright');

/** @internal */
export const createErrorWrapper = createBgWrapper(
	'bgRed',
	createColorWrapper('whiteBright', createModifierWrapper('bold')),
);
