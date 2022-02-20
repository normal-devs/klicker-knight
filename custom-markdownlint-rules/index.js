const path = require('path');

// Hack to get rules to work in vscode
const projectDirectory = path.dirname(__dirname);

require('ts-node').register({
  cwd: projectDirectory,
  project: './custom-markdownlint-rules/tsconfig.json',
});

module.exports = require('./src/rules/index').default;
