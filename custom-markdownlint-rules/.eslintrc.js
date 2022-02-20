module.exports = {
  extends: ['../.eslintrc.js'],
  ignorePatterns: ['index.js'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};