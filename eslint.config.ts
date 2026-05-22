import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import { antfu, GLOB_JS, GLOB_TESTS, GLOB_TS } from '@antfu/eslint-config'

export default antfu(
	{
		test: true,
		stylistic: {
			indent: 'tab',
			overrides: {
				'style/padding-line-between-statements': [
					'error',
					{ blankLine: 'always', prev: '*', next: ['return', 'break', 'continue'] },
					{ blankLine: 'always', prev: 'import', next: '*' },
					{ blankLine: 'any', prev: 'import', next: 'import' },
					{ blankLine: 'always', prev: '*', next: ['block-like', 'multiline-expression'] },
					{ blankLine: 'never', prev: 'case', next: ['block-like', 'multiline-expression'] },
					{ blankLine: 'always', prev: ['block-like', 'multiline-expression'], next: '*' },
					{ blankLine: 'always', prev: '*', next: ['export', 'cjs-export'] },
					{ blankLine: 'any', prev: ['export', 'cjs-export'], next: ['export', 'cjs-export'] },
				],
			},
		},
		pnpm: true,
		formatters: {
			markdown: 'dprint',
			html: 'prettier',
			css: 'prettier',
		},
		typescript: { tsconfigPath: './tsconfig.json' },
	},
	{
		files: [GLOB_JS, GLOB_TS],
		rules: {
			'no-console': 'warn',
			'no-fallthrough': 'off',
			'no-warning-comments': 'warn',
		},
	},
	{
		files: [GLOB_TS],
		rules: {
			'ts/no-explicit-any': 'error',
			'ts/no-unnecessary-condition': 'warn',
			'ts/strict-boolean-expressions': 'off',
			'ts/switch-exhaustiveness-check': [
				'error',
				{ allowDefaultCaseForExhaustiveSwitch: true, considerDefaultExhaustiveForUnions: true },
			],
		},
	},
	{
		files: ['./playground/**/*.js'],
		rules: {
			'no-console': 'off',
		},
	},
	{
		files: [...GLOB_TESTS],
		rules: {
			'ts/no-explicit-any': 'off',
			'ts/no-unsafe-assignment': 'off',
			'ts/no-unsafe-member-access': 'off',
			'ts/no-unsafe-return': 'off',
		},
	},
) as FlatConfigComposer
