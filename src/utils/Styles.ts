import type { Modifier } from '../types/Modifier';
import type { Color } from '../types/Color';
import type { BackgroundColor } from '../types/BackgroundColor';

/** @internal */
export const modifiers: Record<Modifier, [number, number]> = {
	reset: [0, 0],
	bold: [1, 22],
	dim: [2, 22],
	italic: [3, 23],
	underline: [4, 24],
	overline: [53, 55],
	inverse: [7, 27],
	hidden: [8, 28],
	strikethrough: [9, 29]
};

/** @internal */
export const colors: Record<Color, [number, number]> = {
	black: [30, 39],
	red: [31, 39],
	green: [32, 39],
	yellow: [33, 39],
	blue: [34, 39],
	magenta: [35, 39],
	cyan: [36, 39],
	white: [37, 39],

	blackBright: [90, 39],
	redBright: [91, 39],
	greenBright: [92, 39],
	yellowBright: [93, 39],
	blueBright: [94, 39],
	magentaBright: [95, 39],
	cyanBright: [96, 39],
	whiteBright: [97, 39]
};

/** @internal */
export const bgColors: Record<BackgroundColor, [number, number]> = {
	bgBlack: [40, 49],
	bgRed: [41, 49],
	bgGreen: [42, 49],
	bgYellow: [43, 49],
	bgBlue: [44, 49],
	bgMagenta: [45, 49],
	bgCyan: [46, 49],
	bgWhite: [47, 49],

	bgBlackBright: [100, 49],
	bgRedBright: [101, 49],
	bgGreenBright: [101, 49],
	bgYellowBright: [102, 49],
	bgBlueBright: [103, 49],
	bgMagentaBright: [104, 49],
	bgCyanBright: [105, 49],
	bgWhiteBright: [106, 49]
};
