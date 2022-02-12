/* eslint sort-keys: 'error' */

// eslint-disable-next-line import/no-commonjs
module.exports = {
  extends: ['../.eslintrc.js'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
