# Klicker Knight

The spearhead thrust into the untapped market of npm cli games

## Local Development

```bash
npm install

npm run schemas:update

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

Docs are located in [./docs/](./docs/). A good place to start is [./docs/index.md](./docs/index.md).

Tests use [semantic-mocha](./semantic-mocha/README.md) which is currently being developed in this project.

[Custom Eslint Rules](./eslint-local-rules/README.md)

### Developer FAQ

All answers are subject to change.

#### Why are all of the types in one file?

As of 2022-02-02 we haven't solidified the architecture of the game,
so it's difficult to determine where types should live such that there are no circular import dependencies

#### Why aren't there pre-commit or pre-push hooks?

Some devs create a lot of commits and don't want to have to type `--no-verify` all the time.
They also push up a lot of wip code. Additionally, the CI workflow is fast and basically free.

#### Why are compiled files committed to the repository?

Ideally the project should lint/typecheck from a clean clone. The linting steps can be broken down
to make sure that the compilation scripts are valid before they are run, but that hasn't been done yet.

### Adding a new Room State

1. Add a doc for the room in [docs/rooms/](./docs/rooms/)
    - Make sure it's consistent with the other docs.
1. Add a schema file for the new room state in [./src/utils/schemas/normalized/](./src/utils/schemas/normalized/)
1. Update the "oneOf" in [./src/utils/schemas/normalized/roomState.json](./src/utils/schemas/normalized/roomState.json)
to have a "$ref" pointing to the new room state
1. Update the game state schemas with `npm run schemas:update`
1. Create a new subclass of [RoomHandler](./src/roomHandlers/roomHandler.ts)
    1. Create a type alias to reference the room type within the sublcass (for easier maintenance)
1. Update the "allRoomHandlersByRoomType" in [roomUtil](./src/utils/roomUtil.ts) to include the new room handler
1. Add a test to [./tests/src/roomHandlers/](./tests/src/roomHandlers/)
    - Use the [state transition helpers](./tests/testHelpers/buildStateTransitionHelpers.ts)
1. If you are using vs code you might need to:
    - Open a `ts` file and run the `TypeScript: Restart TS Server` command
    - Run the `ESLint: Restart ESLint Server` command
