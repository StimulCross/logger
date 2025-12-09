import { type LogLevel } from '../enums/log-level';
import { type LoggerOverrideConfig } from '../interfaces/logger-override-config';

/**
 * Custom logger override.
 *
 * @remarks
 * Allows replacing the logger’s behavior either with:
 * - a full custom logger implementation (`LoggerOverrideConfig`), or
 * - a single function that handles all log levels.
 *
 * When a function is provided, it receives the log level and all message arguments
 * and is responsible for handling every log call.
 */
export type LoggerOverride = LoggerOverrideConfig | ((level: LogLevel, ...args: unknown[]) => void);
