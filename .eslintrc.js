module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./src/tsconfig.src.json", "./spec/tsconfig.json"],
	},
	plugins: ["@typescript-eslint", "prettier", "import"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"prettier",
	],
	rules: {
		/*
		 * ESLint
		 */
		// Error prevention
		"array-callback-return": "warn",
		"consistent-return": "warn",
		"no-constructor-return": "warn",
		"no-implicit-coercion": "warn",
		"no-promise-executor-return": "error",
		"no-template-curly-in-string": "warn",
		"no-undef-init": "error",
		"no-unreachable-loop": "warn",
		"require-atomic-updates": "warn",
		radix: "warn",

		/*
		 * Prettier
		 */
		"prettier/prettier": "warn",

		/*
		 * Typescript
		 */
		"@typescript-eslint/consistent-type-imports": "warn",
		"@typescript-eslint/explicit-function-return-type": [
			"warn",
			{
				allowExpressions: true,
			},
		],
		"@typescript-eslint/member-delimiter-style": "warn",
		"@typescript-eslint/method-signature-style": "warn",
		"@typescript-eslint/naming-convention": [
			"warn",
			{
				selector: "default",
				format: ["strictCamelCase"],
				leadingUnderscore: "allow",
				trailingUnderscore: "forbid",
			},
			{
				selector: "variable",
				format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
			},
			{
				selector: "property",
				format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
			},
			{ selector: "typeAlias", format: ["StrictPascalCase"] },
			{
				selector: "typeParameter",
				format: ["PascalCase"], // Allow "T", "TValue", "Value" and such
			},
			{
				selector: "interface",
				format: ["StrictPascalCase"],
				custom: {
					regex: "^I[A-Z]",
					match: false,
				},
			},
			{ selector: "class", format: ["StrictPascalCase"] },
			{ selector: "enum", format: ["StrictPascalCase"] },
			{ selector: "enumMember", format: ["UPPER_CASE"] },
		],
		"@typescript-eslint/no-base-to-string": "error",
		"@typescript-eslint/no-confusing-non-null-assertion": "warn",
		"@typescript-eslint/no-dynamic-delete": "error",
		"@typescript-eslint/no-non-null-assertion": "off", // Essential when working with maps
		"@typescript-eslint/no-redeclare": "error",
		"@typescript-eslint/no-shadow": "error",
		"@typescript-eslint/no-throw-literal": "error",
		"@typescript-eslint/no-unnecessary-condition": "warn",
		"@typescript-eslint/prefer-enum-initializers": "warn",
		"@typescript-eslint/prefer-for-of": "warn",
		"@typescript-eslint/prefer-function-type": "warn",
		"@typescript-eslint/prefer-includes": "warn",
		"@typescript-eslint/prefer-nullish-coalescing": "warn",
		"@typescript-eslint/prefer-optional-chain": "warn",
		"@typescript-eslint/prefer-readonly": "warn",
		"@typescript-eslint/prefer-string-starts-ends-with": "warn",
		"@typescript-eslint/require-array-sort-compare": "warn",
		"@typescript-eslint/strict-boolean-expressions": "warn",

		/*
		 * Imports
		 */
		"import/no-absolute-path": "error",
		"import/no-cycle": "warn",
		"import/no-default-export": "warn",
		"import/no-mutable-exports": "warn",
		"import/no-useless-path-segments": "warn",
		"import/no-webpack-loader-syntax": "warn",
	},
};
