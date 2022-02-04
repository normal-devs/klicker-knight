# GameUtil

The [GameUtil](../src/utils/gameUtil.ts) orchestrates
loading the [GameState](../data/GameState),
aggregating the [CommandDescription](../data/commandDescription.md),
[PlayerStateDescription](../data/playerStateDescription.md)
and available [Command](../data/command.md)s,
and saving the new game state.

It interacts with the [GameStateUtil](./gameStateUtil.md) to save and load the GameState,
the [RoomUtil](./roomUtil.md) to run the Command and retrieve
the next [RoomHandler](./roomHandler.md), and the RoomHandler to get the PlayerStateDescription and available Commands.

```mermaid
sequenceDiagram
  autonumber
  participant A as Anything
  participant G as GameUtil
  participant RU as RoomUtil
  participant RH as RoomHandler
  participant GS as GameStateUtil

  A ->> G: run(command: string)
  G ->> GS: load(): GameState
  GS ->> G: gameState: GameState
  G ->> RU: run(command, gameState)
  RU ->> G: newGameState: GameState <br> commandDescription: string
  G ->> RU: getRoomHandler(newGameState)
  RU ->> G: roomHandler: RoomHandler
  G ->> RH: getPlayerStateDescription(newGameState)
  RH ->> G: playerStateDescription: string <br> availableCommands: string[]
  G ->> GS: save(newGameState)
  G ->> A: commandDescription: string <br> playerStateDescription: string <br> availableCommands: string[]
```
