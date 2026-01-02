import { RuntimeFormatter } from './runtime-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { colorize, colorizeError } from '../../common/utils/colorize.js';

/** @internal */
export class DenoFormatter extends RuntimeFormatter {
	protected override _formatError(error: Error, { level }: LogEntry): string {
		if (!this._colors) {
			return error.stack ?? `${error.name}: ${error.message}`;
		}

		const lines: string[] = [
			`${colorizeError(` ${error.name} `, this._colors)} ${colorize(error.message, level, this._colors)}`,
		];

		if (error.stack) {
			lines.push(error.stack);
		}

		return lines.join('\n');
	}
}
