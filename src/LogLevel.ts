export enum LogLevel {
	FATAL,
	ERROR,
	WARNING,
	SUCCESS,
	INFO,
	DEBUG,
	TRACE
}

export function resolveLogLevel(level: string | keyof typeof LogLevel | LogLevel): LogLevel {
	if (typeof level === 'number') {
		if (Object.prototype.hasOwnProperty.call(LogLevel, level)) {
			return level;
		}
		const eligibleLevels = Object.keys(LogLevel)
			.map(k => parseInt(k, 10))
			.filter(k => !isNaN(k) && k < level);
		if (!eligibleLevels.length) {
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
