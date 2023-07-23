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
}
