/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	extends: [
		'plugin:import/errors',
		'plugin:import/warnings',
		'@remix-run/eslint-config',
		'@remix-run/eslint-config/node',
		'prettier',
		'plugin:tailwindcss/recommended',
	],
	settings: {
		'import/ignore': ['node_modules', '\\.(css|md|svg|json)$'],
		'import/resolver': {
			'eslint-import-resolver-node': {
				extensions: ['.js', '.jsx'],
			},
		},
	},
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				disallowTypeAnnotations: true,
				fixStyle: 'inline-type-imports',
			},
		],
		'@typescript-eslint/no-duplicate-imports': 'warn',
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-duplicates': 'error',
		'import/order': [
			'error',
			{
				alphabetize: {
					order: 'asc',
				},
				groups: ['type', 'builtin', 'external', 'internal', 'parent', ['sibling', 'index']],
				'newlines-between': 'always',
				pathGroups: [],
				pathGroupsExcludedImportTypes: [],
			},
		],
		'sort-imports': [
			'error',
			{
				allowSeparatedGroups: true,
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
			},
		],
	},
	overrides: [
		{
			files: ['**/*.ts?(x)'],
			extends: [
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:import/typescript',
			],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
				warnOnUnsupportedTypeScriptVersion: true,
			},
			plugins: ['@typescript-eslint'],
			settings: {
				'import/parsers': {
					'@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
				},
				'import/resolver': {
					'eslint-import-resolver-typescript': {
						alwaysTryTypes: true,
					},
				},
			},
			rules: {
				'@typescript-eslint/ban-ts-comment': 'off',
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-non-null-assertion': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						ignoreRestSiblings: true,
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
					},
				],
			},
		},
	],
}
