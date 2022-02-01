# Klicker Knight

The spearhead thrust into the untapped market of npm cli games

## Local Development

```bash
npm install

npm run compile:gameStateSchema

npm run --silent klicker-knight

# Delete the current save file
npm run clean:game
```

### Configuring Vscode Formatting

- install eslint vscode extension
- install markdownlint vscode extension
- configure settings.json

```json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.format.enable": true,
}
```

### Recommended VSCode Extensions

- [GitHub Markdown Preview](https://marketplace.visualstudio.com/items?itemName=bierner.github-markdown-preview)
- [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)
- [Mermaid Markdown Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=bpruitt-goddard.mermaid-markdown-syntax-highlighting)

### Documentation

Docs are located in [./docs/](./docs/). A good place to start is [./docs/client.md](./docs/client.md).

Tests use [semantic-mocha](./semantic-mocha/README.md) which is currently being developed in this project.
