import { LogLevel } from '../enums/log-level.js';

/** @internal */
export function resolveLogLevel(level: keyof typeof LogLevel | LogLevel): LogLevel {
	if (typeof level === 'number') {
		if (Object.prototype.hasOwnProperty.call(LogLevel, level)) {
			return level;
		}
		const eligibleLevels = Object.keys(LogLevel)
			.map(key => Number.parseInt(key, 10))
			.filter(key => !Number.isNaN(key) && key < level);

		if (eligibleLevels.length === 0) {
			return LogLevel.WARNING;
		}
		return Math.max(...eligibleLevels);
	}

	const strLevel = level.toUpperCase() as keyof typeof LogLevel;

	if (!Object.prototype.hasOwnProperty.call(LogLevel, strLevel)) {
		throw new Error(`Unknown log level string: ${level}`);
	}

	return LogLevel[strLevel];
}
