import type { BackgroundColor } from '../types/BackgroundColor';
import type { Color } from '../types/Color';
import type { Modifier } from '../types/Modifier';
import { modifiers, colors, bgColors } from './Styles';

/** @internal */
export type StylingFunction = (str: string) => string;

/** @internal */
export function createGenericWrapper(open: number, close: number, inner?: StylingFunction): StylingFunction {
	return str => `\u001B[${open}m${inner ? inner(str) : str}\u001B[${close}m`;
}

/** @internal */
export function createModifierWrapper(modifier: Modifier, innerWrapper?: StylingFunction): StylingFunction {
	const [open, close] = modifiers[modifier];
	return createGenericWrapper(open, close, innerWrapper);
}

/** @internal */
export function createColorWrapper(color: Color, innerWrapper?: StylingFunction): StylingFunction {
	const [open, close] = colors[color];
	return createGenericWrapper(open, close, innerWrapper);
}

/** @internal */
export function createBgWrapper(color: BackgroundColor, innerWrapper?: StylingFunction): StylingFunction {
	const [open, close] = bgColors[color];
	return createGenericWrapper(open, close, innerWrapper);
}
