# RoomUtil

The [RoomUtil](../src/utils/roomUtil.ts) abstracts selecting a random [RoomHandler](./roomHandler.md),
or selecting a RoomHandler by [GameState](../data/GameState.md) or [room id](../data/RoomId.md)

It also abstracts coercing a nullable [RoomState](../data/roomState.md) which is used by the [GameUtil](./gameUtil.md)
to make sure that there is a new valid RoomState after a player runs a [Command](../data/command.md).

## GetRandomRoomHandler

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil

  A ->> RU: getRandomRoomHandler()
  note over RU: T extends RoomId
  RU ->> RU: pick random roomId <br> roomId: T <br> getRoomHandlerByRoomId<T>(roomId) <br> roomHandler: RoomHandler<T>
  RU ->> A: roomHandler: RoomHandler
```

## GetRoomHandlerByGameState

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil

  A ->> RU: getRoomHandlerByGameState(gameState: Gamestate)
  note over RU: T extends RoomId <br> gameState.roomState: RoomState<T> <br> roomState.roomId: T
  RU ->> RU: getRoomHandlerByRoomId<T>(roomId) <br> roomHandler: RoomHandler<T>
  RU ->> A: roomHandler: RoomHandler
```

## GetRoomHandlerByRoomId

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil
  participant RH as RoomHandler<T>

  note over RH: T extends RoomId

  A ->> RU: getRoomHandlerByRoomId<T extends RoomId>(roomId: T)
  RU ->> RU: lookup RoomHandler <br> subclass by roomId
  RU ->> RH: instantiate
  RH ->> RU: roomHandler: RoomHandler<T>
  RU ->> A: roomHandler: RoomHandler<T>
```

## CoerceRoomState

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil
  participant RH as RoomHandler<RoomId>

  A ->> RU: coerceRoomState(roomState: RoomState<RoomId> | null)

  alt roomState is null
    note over RU: The player left the current room

    RU ->> RU: getRandomRoomHandler() <br> roomHandler: RoomHandler<RoomId>
    RU ->> RH: getNewRoomState()
    RH ->> RU: newRoomState: RoomState<RoomId>
    RU ->> RU: nextRoomState = newRoomstate
  else
    RU ->> RU: nextRoomState = roomState
  end

  RU ->> A: nextRoomState: RoomState<RoomId>
```
