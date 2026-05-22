import type { LogEntry } from './interfaces/log-entry.js'
import type { LogObserver } from './types/log-observer.js'

/** @internal */
export class LoggerObserver {
	private static readonly _observers: Set<LogObserver> = new Set()

	public static add(observer: LogObserver): void {
		this._observers.add(observer)
	}

	public static remove(observer: LogObserver): void {
		this._observers.delete(observer)
	}

	public static notify(entry: LogEntry): void {
		for (const observer of this._observers) {
			try {
				void observer(entry)
			}
			catch {
				// Observer errors must not affect logging
			}
		}
	}
}
