import { ANSI_BG_COLORS, ANSI_COLORS, ANSI_MODIFIERS } from './ansi-styles.js';
import { type BackgroundColor } from '../types/background-color.js';
import { type Color } from '../types/color.js';
import { type Modifier } from '../types/modifier.js';

/** @internal */
export type StylingFunction = (str: string) => string;

/** @internal */
export function createGenericWrapper(open: number, close: number, inner?: StylingFunction): StylingFunction {
	return str => `\u001B[${open}m${inner ? inner(str) : str}\u001B[${close}m`;
}

/** @internal */
export function createModifierWrapper(modifier: Modifier, innerWrapper?: StylingFunction): StylingFunction {
	const [open, close] = ANSI_MODIFIERS[modifier];
	return createGenericWrapper(open, close, innerWrapper);
}

/** @internal */
export function createColorWrapper(color: Color, innerWrapper?: StylingFunction): StylingFunction {
	const [open, close] = ANSI_COLORS[color];
	return createGenericWrapper(open, close, innerWrapper);
}

/** @internal */
export function createBgWrapper(color: BackgroundColor, innerWrapper?: StylingFunction): StylingFunction {
	const [open, close] = ANSI_BG_COLORS[color];
	return createGenericWrapper(open, close, innerWrapper);
}
