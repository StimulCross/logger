import { RuntimeFormatter } from './runtime-formatter.js';
import { type LogEntry } from '../../common/interfaces/log-entry.js';
import { createErrorWrapper } from '../../common/utils/common-wrappers.js';
import { LOG_LEVEL_TO_COLOR_MAP } from '../../common/utils/log-level-map.js';

/** @internal */
export class DenoFormatter extends RuntimeFormatter {
	protected override _formatError(error: Error, { level }: LogEntry): string {
		if (!this._colors) {
			return error.stack ?? `${error.name}: ${error.message}`;
		}

		const lines: string[] = [
			`${createErrorWrapper(` ${error.name} `)} ${LOG_LEVEL_TO_COLOR_MAP[level](error.message)}`,
		];

		if (error.stack) {
			lines.push(error.stack);
		}

		return lines.join('\n');
	}
}
