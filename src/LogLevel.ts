import * as isNode from 'detect-node';

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

	// TODO drop the replace for next major, it keeps the old deprecated debug1/2/3 levels running
	const strLevel = level.replace(/\d+$/, '').toUpperCase() as keyof typeof LogLevel;

	if (!Object.prototype.hasOwnProperty.call(LogLevel, strLevel)) {
		throw new Error(`Unknown log level string: ${level}`);
	}

	return LogLevel[strLevel];
}

export type LogLevelMap<T> = { [severity in LogLevel]: T };

// Node 8+ defines console.debug as noop, and earlier versions don't define it at all
const debugFunction = isNode ? console.log.bind(console) : console.debug.bind(console);

export const LogLevelToConsoleFunction: LogLevelMap<(...args: unknown[]) => void> = {
	[LogLevel.FATAL]: console.error.bind(console),
	[LogLevel.ERROR]: console.error.bind(console),
	[LogLevel.WARNING]: console.warn.bind(console),
	[LogLevel.SUCCESS]: console.info.bind(console),
	[LogLevel.INFO]: console.info.bind(console),
	[LogLevel.DEBUG]: debugFunction.bind(console),
	[LogLevel.TRACE]: console.trace.bind(console)
};
