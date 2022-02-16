module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    'import/no-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'mocha/no-setup-in-describe': 'off',
  },
};
