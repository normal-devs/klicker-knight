// eslint-plugin-local-rules looks for this file: https://www.npmjs.com/package/eslint-plugin-local-rules

require('ts-node').register({
  project: './eslint-local-rules/tsconfig.json',
});

module.exports = require('./src/index.ts').default;
