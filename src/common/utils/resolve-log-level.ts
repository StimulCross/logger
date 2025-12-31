import { DEFAULT_OPTIONS } from '../constants.js';
import { LogLevel } from '../enums/log-level.js';

/** @internal */
export function resolveLogLevel(level: keyof typeof LogLevel | Lowercase<keyof typeof LogLevel> | LogLevel): LogLevel {
	if (typeof level === 'number') {
		if (Object.hasOwn(LogLevel, level)) {
			return level;
		}
		const eligibleLevels = Object.keys(LogLevel)
			.map(key => Number.parseInt(key, 10))
			.filter(key => !Number.isNaN(key) && key < level);

		if (eligibleLevels.length === 0) {
			return DEFAULT_OPTIONS.minLevel;
		}
		return Math.max(...eligibleLevels);
	}

	const strLevel = level.trim().toUpperCase() as keyof typeof LogLevel;

	if (!Object.hasOwn(LogLevel, strLevel)) {
		throw new Error(`Unknown log level string: ${level}`);
	}

	return LogLevel[strLevel];
}
