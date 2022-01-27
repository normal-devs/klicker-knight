# Data Abstraction

The GameStateUtil abstracts the behavior of the DatabaseUtil and the underlying JSON file where the game state is stored.

See the [client](./client.md) diagram for more information on how `gameStateUtil` is invoked.

## Save

```mermaid
sequenceDiagram
  autonumber
  participant A as Anything
  participant G as GameStateUtil
  participant D as DatabaseUtil
  participant F as File

  A ->> G: gameStateUtil.save(newGameState: GameState)
  G ->> D: databaseUtil.save(gameState: object)
  D ->> D: serialize gameState
  D ->> F: write serialized gameState
```

## Load

```mermaid
sequenceDiagram
  autonumber
  participant A as Anything
  participant G as GameStateUtil
  participant D as DatabaseUtil
  participant F as File

  A ->> G: gameStateUtil.load()
  G ->> D: databaseUtil.load()
  D ->> F: read file
  F ->> D: serializedData: string
  D ->> D: parse serializedData
  D ->> G: data: unknown
  G ->> G: validate data <br> is GameState

  alt data is not valid
    G ->> G: init() <br> gameState: GameState
    G ->> D: save -> see "Save" diagram
  end

  G ->> A: gameState: GameState
```
