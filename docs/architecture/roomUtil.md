# RoomUtil

The [RoomUtil](../src/utils/roomUtil.ts) abstracts selecting a random [RoomHandler](./roomHandler.md),
or selecting a RoomHandler by [GameState](../data/GameState.md) or [room type](../data/roomType.md)

It also abstracts coercing a nullable [RoomState](../data/roomState.md) which is used by the [GameUtil](./gameUtil.md)
to make sure that there is a new valid RoomState after a player runs a [Command](../data/command.md).

## CoerceRoomState

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil
  participant RH as RoomHandler<RoomType>

  A ->> RU: coerceRoomState(roomState: RoomState<RoomType> | null)

  alt roomState is null
    note over RU: The player left the current room

    RU ->> RU: getRandomRoomHandler() <br> roomHandler: RoomHandler<RoomType>
    RU ->> RH: getNewRoomState()
    RH ->> RU: newRoomState: RoomState<RoomType>
    RU ->> RU: nextRoomState = newRoomstate
  else
    RU ->> RU: nextRoomState = roomState
  end

  RU ->> A: nextRoomState: RoomState<RoomType>
```

## GetRandomRoomHandler

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil

  A ->> RU: getRandomRoomHandler()
  note over RU: T extends RoomType
  RU ->> RU: pick random roomType <br> roomType: T <br> getRoomHandlerByRoomType<T>(roomType) <br> roomHandler: RoomHandler<T>
  RU ->> A: roomHandler: RoomHandler
```

## GetRoomHandlerByGameState

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil

  A ->> RU: getRoomHandlerByGameState(gameState: Gamestate)
  note over RU: T extends RoomType <br> gameState.roomState: RoomState<T> <br> roomState.roomType: T
  RU ->> RU: getRoomHandlerByRoomType<T>(roomType) <br> roomHandler: RoomHandler<T>
  RU ->> A: roomHandler: RoomHandler
```

## GetRoomHandlerByRoomType

```mermaid
sequenceDiagram
  autonumber

  participant A as Actor
  participant RU as RoomUtil
  participant RH as RoomHandler<T>

  note over RH: T extends RoomType

  A ->> RU: getRoomHandlerByRoomType<T extends RoomType>(roomType: T)
  RU ->> RU: lookup RoomHandler <br> subclass by roomType
  RU ->> RH: instantiate
  RH ->> RU: roomHandler: RoomHandler<T>
  RU ->> A: roomHandler: RoomHandler<T>
```
