/**
 * An interface extending `Intl.DateTimeFormatOptions` to configure formatting of date and time.
 *
 * This interface allows specifying options for customizing the output of date and
 * time in a localized format, with an optional `locale` property to explicitly
 * define the desired locale.
 */
export interface LoggerDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
	/**
	 * The locale identifier for the desired locale.
	 */
	locale?: string
}
