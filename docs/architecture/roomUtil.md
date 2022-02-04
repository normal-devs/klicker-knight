# RoomUtil

The [RoomUtil](../src/utils/roomUtil.ts) abstracts selecting the [RoomHandler](./roomHandler.md) for a given [GameState](../data/GameState.md),
passing the [RoomState](../data/roomState.md) to the current RoomHandler,
and finding a new GameState when the player leaves the current [Room](../data/Room.md).

Since the RoomUtil has to handle the player leaving the room,
it also has to aggregate  [CommandDescription](../data/commandDescription.md) along with the new GameState.

```mermaid
sequenceDiagram
  autonumber
  participant A as Anything
  participant RU as RoomUtil
  participant RH1 as RoomHandler<RoomId1>
  participant RH2 as RoomHandler<RoomId2>

  note over A,RU: type RoomState = Room1State | Room2State
  A ->> RU: run(command: string, gameState: GameState)
  RU ->> RU: getRoomHandler(gameState)
  RU ->> RU: roomHandler1: RoomHandler<RoomId1>
  RU ->> RU: gameState.roomState: Room1State
  RU ->> RU: roomState1: Room1State
  RU ->> RH1: run(command, roomState1)
  RH1 ->> RU: commandDescription: string <br> roomState1': RoomState<RoomId1> | null

  alt roomState1' is null
    note over RU: The player left the current room
    RU ->> RU: getRandomRoomHandler()
    RU ->> RU: roomHandler2: RoomHandler<RoomId2>
    RU ->> RH2: initRoomState()
    RH2 ->> RU: roomState2: RoomState
  end

  RU ->> A: commandDescription: string <br> roomState: RoomState
```
