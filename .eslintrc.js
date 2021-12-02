module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.linters.json', 'tsconfig.json', 'tests/tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
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
  },
};
