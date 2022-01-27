# RoomHandlerUtil

The roomHandlerUtil abstracts looking up the [RoomHandler](./roomHandler.md)
for a specific [Room](./room.md) based on a `roomId`.
`roomId` is of type `RoomId` which is an enum or string union.

See the [client](./client.md) diagram to see how the roomHandlerUtil is invoked.

```mermaid
sequenceDiagram
  autonumber
  participant A as Anything
  participant RHU as RoomHandlerUtil
  participant RHS as RoomHandler Subclass
  participant RHC as RoomHandler<T extends RoomId> <br> Class

  A ->> RHU: roomHandlerUtil.lookup(roomId: RoomId)
  RHU ->> RHU: Find corresponding <br> RoomHandler subclass <br> (RoomHandler<roomId>)
  RHU ->> RHS: new RoomHandler<roomId>();
  RHS ->> RHC: super()
  RHS ->> RHU: room: RoomHandler<roomId>
  note over A,RHU: Note that the below type <br> is RoomId and not roomId <br> because the specific type <br> shouldn't matter
  RHU ->> A: room: RoomHandler<RoomId>
```
