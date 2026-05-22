import type { LogEntry } from '../interfaces/log-entry.js'
import type { LoggerDateTimeFormatOptions } from '../interfaces/logger-date-time-format-options.js'
import type { LoggerOptions } from '../interfaces/logger-options.js'
import type { LoggerDateTimeFormatter } from '../types/logger-date-time-formatter.js'
import { DEFAULT_OPTIONS } from '../constants.js'

/** @internal */
export abstract class LogFormatter {
	protected readonly _dateTimeFormatter?: LoggerDateTimeFormatter
	protected readonly _dateTimeFormatOptions?: LoggerDateTimeFormatOptions

	constructor(protected readonly _options: LoggerOptions) {
		const { dateTimeFormat } = this._options

		if (typeof dateTimeFormat === 'function') {
			this._dateTimeFormatter = dateTimeFormat
			this._dateTimeFormatOptions = DEFAULT_OPTIONS.dateTimeFormat
		}
		else if (typeof dateTimeFormat === 'object') {
			this._dateTimeFormatOptions = {
				...DEFAULT_OPTIONS.dateTimeFormat,
				...dateTimeFormat,
			}
		}
	}

	public abstract formatToParts(entry: LogEntry, ...args: unknown[]): unknown[]
}
