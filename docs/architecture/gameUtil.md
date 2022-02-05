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

## Run

```mermaid
sequenceDiagram
  autonumber
  participant A as Actor
  participant GU as GameUtil
  participant RU as RoomUtil
  participant RH1 as RoomHandler<T1>
  participant RH2 as RoomHandler<T1 | T2>
  participant GS as GameStateUtil

  note over RH1, RH2: TX extends RoomId <br> T1 can equal T2

  A ->> GU: run(command: string)

  GU ->> GS: load()
  GS ->> GU: gameState: GameState

  GU ->> RU: getRoomHandlerByGameState(gameState)
  RU ->> GU: roomHandlerA: RoomHandler<T1>

  GU ->> RH1: run(gameState.roomState, command)
  RH1 ->> GU: commandDescription: CommandDescription <br> roomState': RoomState<T1> | null

  GU ->> RU: coerceRoomState(roomState')
  RU ->> GU: nextRoomState: RoomState<T1 | T2>

  GU ->> RU: getRoomHandler(nextRoomState)
  RU ->> GU: roomHandlerB: RoomHandler<T1 | T2>
  GU ->> GU: nextGameState: GameState

  GU ->> RH2: getPlayerStateDescription(nextGameState)
  RH2 ->> GU: playerStateDescription: string <br> availableCommands: string[]

  GU ->> GS: save(nextGameState)

  GU ->> A: commandDescription: string <br> playerStateDescription: string <br> availableCommands: string[]
```
