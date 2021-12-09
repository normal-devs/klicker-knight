module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'plugin:mocha/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.linters.json',
      'tsconfig.json',
      'tests/tsconfig.json',
    ],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
      },
    ],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-mocha-arrows': 'off',
  },
};
