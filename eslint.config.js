import node from '@stimulcross/eslint-config-node';
import nodeStyle from '@stimulcross/eslint-config-node/style';
import typescript from '@stimulcross/eslint-config-typescript';
import typescriptStyle from '@stimulcross/eslint-config-typescript/style';
import { defineConfig, globalIgnores } from 'eslint/config';

const globs = {
	js: ['**/*.js', '**/*.cjs', '**/*.mjs'],
	ts: ['**/*.ts', '**/*.cts', '**/*.mts'],
	tsSpec: ['**/*.spec.ts', '**/*.spec.cts', '**/*.spec.mts'],
	lib: '**/lib',
	nodeModules: '**/node_modules',
	coverage: '**/coverage',
	dts: '**/*.d.ts',
};

const namingConvention = typescriptStyle.rules['@typescript-eslint/naming-convention'].map(rule => {
	if (typeof rule !== 'object') {
		return rule;
	}

	if (rule.selector === 'variable' && rule.types?.includes('boolean')) {
		rule.filter = { regex: '^(timestamps|colors|pid)', match: false };
	}

	return rule;
});

export default defineConfig(
	globalIgnores([globs.lib, globs.nodeModules, globs.coverage, globs.dts]),
	{
		files: [...globs.js],
		...node,
	},
	{
		files: [...globs.js],
		...nodeStyle,
	},
	{
		files: [...globs.ts, ...globs.tsSpec],
		...typescript,
	},
	{
		files: [...globs.ts, ...globs.tsSpec],
		...typescriptStyle,
	},
	{
		files: [...globs.ts],
		rules: {
			'unicorn/prefer-native-coercion-functions': 'off',
			'@typescript-eslint/explicit-member-accessibility': [
				'error',
				{
					accessibility: 'explicit',
					overrides: {
						accessors: 'explicit',
						constructors: 'no-public',
						methods: 'explicit',
						properties: 'off',
						parameterProperties: 'explicit',
					},
				},
			],
			'@typescript-eslint/naming-convention': namingConvention,
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/unified-signatures': 'off',
		},
	},
	{
		files: [...globs.tsSpec],
		rules: {
			'id-length': 'off',
			'no-console': 'off',
			'max-classes-per-file': 'off',
			'max-nested-callbacks': ['warn', { max: 10 }],
			'unicorn/consistent-function-scoping': 'off',
			'unicorn/no-useless-undefined': 'off',
			'@typescript-eslint/class-literal-property-style': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-loop-func': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/unbound-method': 'off',
		},
	},
);
