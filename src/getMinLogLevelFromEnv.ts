import type { LogLevel } from './LogLevel';
import { resolveLogLevel } from './LogLevel';

const data: Array<[string[] | undefined, LogLevel]> =
	typeof process === 'undefined'
		? []
		: // eslint-disable-next-line node/no-process-env
		  process.env.LOGGING?.split(';')
				.map(part => {
					const [namespace, strLevel] = part.split('=', 2) as [string, string];

					if (strLevel) {
						return [namespace === 'default' ? undefined : namespace.split(':'), resolveLogLevel(strLevel)];
					}

					return null;
				})
				.filter((v): v is [string[] | undefined, LogLevel] => Boolean(v))
				.sort(([a], [b]) => (b?.length ?? 0) - (a?.length ?? 0)) ?? [];

const defaultIndex = data.findIndex(([nsParts]) => !nsParts);
let defaultLevel: LogLevel | undefined;

if (defaultIndex !== -1) {
	defaultLevel = data[defaultIndex][1];
	data.splice(defaultIndex);
}

function isPrefix(value: string[], prefix: string[]): boolean {
	return prefix.length <= value.length && prefix.every((item, i) => item === value[i]);
}

/** @internal */
export function getMinLogLevelFromEnv(name: string): LogLevel | undefined {
	const nameSplit = name.split(':');
	for (const [nsParts, level] of data) {
		if (isPrefix(nameSplit, nsParts!)) {
			return level;
		}
	}

	return defaultLevel;
}
