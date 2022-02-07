# GameStateUtil

The [GameStateUtil](../../src/utils/gameStateUtil.ts) enforces a valid [GameState](./gameState.md)
when loading and saving data via the [DatabaseUtil](./databaseUtil.md).

## Load

```mermaid
sequenceDiagram
  autonumber
  participant A as Actor
  participant G as GameStateUtil
  participant D as DatabaseUtil

  A ->> G: load()
  G ->> D: load()
  D ->> G: data: unknown

  G ->> G: validate(data)

  alt data is GameState
    G ->> G: gameState: GameState
  else
    G ->> G: init() <br> gameState: GameState
    G ->> D: save(gameState)
  end

  G ->> A: gameState: GameState
```

## Save

```mermaid
sequenceDiagram
  autonumber
  participant A as Actor
  participant G as GameStateUtil
  participant D as DatabaseUtil

  A ->> G: save(data: unknown)
  G ->> G: validate(data)

  alt data is not GameState
    note over G: Error
  end

  G ->> D: save(data)
    D ->> G: isSaved: boolean

  alt failed to save
      note over G: Error
  end
```
