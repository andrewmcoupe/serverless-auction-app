module.exports = {
  extends: ['@cinch-labs/eslint-config'],
  env: {
    node: true,
  },
  rules: {
    'no-console': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  overrides: [
    {
      files: ['**/*.{test,tests}.{ts}'],
      rules: {
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
  ],
}
