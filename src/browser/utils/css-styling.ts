import { LogLevel } from '../../common/enums/log-level.js';
import { type Modifier } from '../../common/types/modifier.js';
import { type LogLevelMap } from '../../common/utils/log-level-map.js';

/** @internal */
export const COLORS = {
	error: '#f63a3a',
	warning: '#ff9806',
	success: '#02b938',
	info: '#1586ee',
	debug: '#bb32de',
	trace: '#1098ad',
	accent: '#ff9806',
	white: '#ffffff',
	gray: '#909090',
};

/** @internal */
export const COLOR_STYLES = {
	error: `color:${COLORS.error};`,
	warning: `color:${COLORS.warning};`,
	success: `color:${COLORS.success};`,
	info: `color:${COLORS.info};`,
	debug: `color:${COLORS.debug};`,
	trace: `color:${COLORS.trace};`,
	accent: `color:${COLORS.accent};`,
	white: `color:${COLORS.white};`,
	gray: `color:${COLORS.gray};`,
};

/** @internal */
export const BACKGROUND_COLOR_STYLES = {
	fatal: `background-color:${COLORS.error};`,
};

/** @internal */
export const MODIFIER_STYLES: Record<Modifier, string> = {
	reset: 'color:inherit;font-weight:inherit;background-color:inherit;opacity:inherit;text-decoration:inherit;filter:inherit;visibility:inherit;',
	bold: 'font-weight:bold;',
	dim: 'opacity:0.5;',
	italic: 'font-style:italic;',
	underline: 'text-decoration:underline;',
	inverse: 'filter:invert(1);',
	hidden: 'visibility:hidden;',
	strikethrough: 'text-decoration:line-through;',
};

/** @internal */
export const LOG_LEVEL_TO_TYPE_COLOR_MAP: LogLevelMap<string> = {
	[LogLevel.FATAL]: `${BACKGROUND_COLOR_STYLES.fatal}${COLOR_STYLES.white}${MODIFIER_STYLES.bold}`,
	[LogLevel.ERROR]: `${COLOR_STYLES.error}${MODIFIER_STYLES.bold}`,
	[LogLevel.WARNING]: `${COLOR_STYLES.warning}${MODIFIER_STYLES.bold}`,
	[LogLevel.SUCCESS]: `${COLOR_STYLES.success}${MODIFIER_STYLES.bold}`,
	[LogLevel.INFO]: `${COLOR_STYLES.info}${MODIFIER_STYLES.bold}`,
	[LogLevel.DEBUG]: `${COLOR_STYLES.debug}${MODIFIER_STYLES.bold}`,
	[LogLevel.TRACE]: `${COLOR_STYLES.trace}${MODIFIER_STYLES.bold}`,
};

/** @internal */
export const LOG_LEVEL_TO_COLOR_MAP: LogLevelMap<string> = {
	[LogLevel.FATAL]: COLOR_STYLES.error,
	[LogLevel.ERROR]: COLOR_STYLES.error,
	[LogLevel.WARNING]: COLOR_STYLES.warning,
	[LogLevel.SUCCESS]: COLOR_STYLES.success,
	[LogLevel.INFO]: COLOR_STYLES.info,
	[LogLevel.DEBUG]: COLOR_STYLES.debug,
	[LogLevel.TRACE]: COLOR_STYLES.trace,
};

/** @internal */
export const ACCENT_COLOR = COLOR_STYLES.accent;

/** @internal */
export const GRAY_COLOR = COLOR_STYLES.gray;
