/* eslint sort-keys: 'error' */

module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:mocha/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.configFiles.json',
      'tsconfig.json',
      'tests/tsconfig.json',
    ],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-mocha-arrows': 'off',
  },
};
