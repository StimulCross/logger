import { env } from 'std-env';
import { type LogLevel } from '../../common/enums/log-level.js';
import { resolveLogLevel } from '../../common/utils/resolve-log-level.js';

interface Rule {
	namespace?: string[];
	level: LogLevel;
}

/**
 * Parses LOGGING env variable.
 *
 * Format: default=INFO;app=DEBUG;app:db=TRACE
 */
function parseLoggingEnv(value?: string): { rules: Rule[]; defaultLevel?: LogLevel } {
	if (!value) {
		return { rules: [] };
	}

	const rules: Rule[] = [];
	let defaultLevel: LogLevel | undefined;

	for (const rawPart of value.split(';')) {
		const part = rawPart.trim();

		if (!part) {
			continue;
		}

		const [rawNs, rawLevel] = part.split('=', 2);

		if (!rawNs || !rawLevel) {
			continue;
		}

		const ns = rawNs.trim();
		const level = resolveLogLevel(rawLevel as keyof typeof LogLevel);

		if (ns.toLowerCase() === 'default') {
			defaultLevel = level;
			continue;
		}

		const parts = ns
			.split(':')
			.map(nsPart => nsPart.trim())
			.filter(Boolean);

		if (parts.length === 0) {
			continue;
		}

		rules.push({ namespace: parts, level });
	}

	rules.sort((ruleA, ruleB) => (ruleB.namespace?.length ?? 0) - (ruleA.namespace?.length ?? 0));

	return { rules, defaultLevel };
}

function isPrefix(value: string[], prefix: string[]): boolean {
	return prefix.length <= value.length && prefix.every((item, i) => item === value[i]);
}

/** @internal */
export function getMinLogLevelFromEnv(name: string): LogLevel | undefined {
	const { rules, defaultLevel } = parseLoggingEnv(env.LOGGING);

	const parts = name
		.split(':')
		.map(part => part.trim())
		.filter(Boolean);

	for (const rule of rules) {
		if (rule.namespace && isPrefix(parts, rule.namespace)) {
			return rule.level;
		}
	}

	return defaultLevel;
}
