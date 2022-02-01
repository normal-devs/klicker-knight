/* eslint sort-keys: 'error' */

// eslint-disable-next-line import/no-commonjs
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
      'eslint-local-rules/tsconfig.json',
      'eslint-local-rules/tests/tsconfig.json',
      'tests/tsconfig.json',
      'semantic-mocha/tsconfig.json',
      'semantic-mocha/tests/tsconfig.json',
    ],
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-local-rules'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    'import/no-commonjs': 'error',
    'import/no-default-export': 'error',
    'import/no-import-module-exports': 'off',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            except: ['./src/utils/types/index.ts'],
            from: './src/utils/types/gameState.d.ts',
            message:
              'Make src/utils/types/gameState.d.ts types available in src/utils/types/index.ts to provide a unified interface for other modules. Then import from src/utils/types/',
            target: './',
          },
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
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
