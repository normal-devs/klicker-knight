# Klicker Knight

[klickerKnight.ts](../../src/klickerKnight.ts) represents the entry point to the game.
It abstracts the string input and output from the [GameUtil](./gameUtil.md).

## npm run klicker-knight

```mermaid
sequenceDiagram
  autonumber
  actor P as Player
  participant K as Klicker Knight
  participant G as GameUtil

  P ->> K: npm run klicker-knight [<command> = 'default']
  K ->> G: run(command);
  G ->> K: gameOutput: GameOutput
  K ->> K: output = formatGameOutput(gameOutput): string;
  K ->> P: output: string
```
