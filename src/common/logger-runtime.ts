import type { LogLevel } from './enums/log-level.js'
import type { LogObserver } from './types/log-observer.js'
import { LoggerObserver } from './logger-observer.js'
import { resolveLogLevel } from './utils/resolve-log-level.js'

/**
 * A utility class for managing global logger runtime state.
 *
 * `LoggerRuntime` provides a minimal control layer for all logger instances.
 * It allows globally enabling/disabling logging or enforcing a minimum log level.
 */
export class LoggerRuntime {
	private static _isEnabled: boolean = true
	private static _globalMinLevel: LogLevel | null = null

	/**
	 * Indicates whether logging is globally enabled.
	 *
	 * @remarks
	 * When set to `false`, all loggers are effectively silenced,
	 * regardless of their individual configuration.
	 */
	public static get isEnabled(): boolean {
		return this._isEnabled
	}

	/**
	 * The minimum log level enforced globally.
	 *
	 * @remarks
	 * If set, this value acts as a global lower bound for log output.
	 * Individual logger instances cannot emit log entries below this level,
	 * even if their local minimum level is lower.
	 *
	 * A value of `null` indicates that no global minimum is enforced,
	 * and individual logger configurations are used as-is.
	 */
	public static get globalMinLevel(): LogLevel | null {
		return this._globalMinLevel
	}

	/**
	 * Enables or disables logging globally.
	 *
	 * @param isEnabled Whether logging should be enabled.
	 *
	 * @remarks
	 * This method updates global runtime state only.
	 * No logger instances are recreated or modified.
	 *
	 * The change takes effect immediately for all loggers.
	 */
	public static setEnabled(isEnabled: boolean): void {
		this._isEnabled = isEnabled
	}

	/**
	 * Sets a global minimum log level.
	 *
	 * @param level The minimum log level to enforce globally.
	 * Accepts a {@link LogLevel} value, its string representation,
	 * or `null` to clear the global override.
	 *
	 * @remarks
	 * When set, this level has priority over individual logger minimum levels.
	 *
	 * Passing `null` removes the global override entirely.
	 *
	 * This method can be useful for:
	 * - runtime log-level escalation
	 * - environment-based configuration
	 * - operational debugging without restarting the process
	 */
	public static setGlobalMinLevel(
		level: LogLevel | keyof typeof LogLevel | Lowercase<keyof typeof LogLevel> | null,
	): void {
		this._globalMinLevel = level === null ? null : resolveLogLevel(level)
	}

	/**
	 * Subscribes an observer to log events.
	 *
	 * @param observer A function that receives log events.
	 *
	 * @remarks
	 * Observers are invoked synchronously after log-level filtering and cannot affect log output or control flow.
	 *
	 * @returns A function that unsubscribes the observer.
	 */
	public static subscribe(observer: LogObserver): () => void {
		LoggerObserver.add(observer)

		return () => LoggerObserver.remove(observer)
	}
}
