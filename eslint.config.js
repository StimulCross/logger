import { defineConfig, GLOB_TESTS } from '@stimulcross/eslint-config'

export default defineConfig(
	{
		test: true,
		pnpm: true,
		node: true,
		formatters: { markdown: 'dprint' },
		typescript: {
			tsconfigPath: './tsconfig.json',
			overridesTypeAware: {
				'ts/naming-convention': 'off',
				'ts/no-non-null-assertion': 'off',
			},
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
			'max-classes-per-file': 'off',
			'no-empty-function': 'off',
			'unicorn/consistent-function-scoping': 'off',
			'unicorn/no-useless-undefined': 'off',
			'ts/no-explicit-any': 'off',
			'ts/no-unsafe-assignment': 'off',
			'ts/no-unsafe-member-access': 'off',
			'ts/no-unsafe-return': 'off',
		},
	},
)
