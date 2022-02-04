/* eslint sort-keys: 'error' */

// eslint-disable-next-line import/no-commonjs
module.exports = {
  extends: ['../.eslintrc.js'],
  rules: {
    'func-names': 'off',
    'local-rules/semantic-mocha/no-member-only': 'error',
    'local-rules/semantic-mocha/no-member-skip': 'error',
    'mocha/max-top-level-suites': 'off',
    'mocha/no-hooks-for-single-case': 'off',
  },
};
