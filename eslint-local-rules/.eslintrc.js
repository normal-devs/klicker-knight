module.exports = {
  extends: ['../.eslintrc.js'],
  ignorePatterns: ['index.js', 'dist/*'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
