import type { LogLevel } from './LogLevel';

export interface Logger {
	log: (level: LogLevel, ...args: unknown[]) => void;
	fatal: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
	success: (...args: unknown[]) => void;
	info: (...args: unknown[]) => void;
	debug: (...args: unknown[]) => void;
	trace: (...args: unknown[]) => void;
}
