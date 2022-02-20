require('ts-node').register({
  project: './custom-markdownlint-rules/tsconfig.json',
});

module.exports = require('./src/rules/index').default;
