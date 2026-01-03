/**
 * A color variant for ANSI color palette.
 *
 * @remarks
 * Determines which ANSI color set to use when formatting log output.
 *
 * - `standard` - Uses standard ANSI colors (default intensity)
 * - `bright` - Uses bright ANSI colors (high intensity)
 *
 * @see {@link LoggerOptions.colors}
 */
export type ColorVariant = 'standard' | 'bright';
