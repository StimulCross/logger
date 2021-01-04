import type { LogLevel } from './LogLevel';

export interface Logger {
	log: (level: LogLevel, message: string) => void;

	// convenience
	crit: (message: string) => void;
	critical: (message: string) => void;
	err: (message: string) => void;
	error: (message: string) => void;
	warn: (message: string) => void;
	warning: (message: string) => void;
	info: (message: string) => void;
	debug: (message: string) => void;
	trace: (message: string) => void;
}
