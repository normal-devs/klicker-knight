# Client

The client is the entry point of the application along with some of the top level logic that runs on each command.

See the [Data Abstraction](./dataAbstraction.md), [RoomHandlerUtil](./roomHandlerUtil.md) and [RoomHandler](./roomHandler.md)
diagrams for more details on their behavior.

```mermaid
sequenceDiagram
  autonumber
  actor P as Player
  participant C as Client
  participant RH as RoomHandler

  P ->> C: klicker-knight [<command = 'default'>] [...<subcommands>]
  C ->> C: gameState: GameState = <br>gameStateUtil.load()
  C ->> C: handler: RoomHandler = roomHandlerUtil.lookup(gameState)

  C ->> RH: handler.run(gameState, command, ...subcommands)
  RH ->> C: newGameState: GameState

  alt game state changed
    C ->> C: gameStateUtil.save(newGameState: GameState)
  end

  C ->> C: output: string = <br> gameState.getDescriptionAndCommands()
  C ->> P: current command description, <br> current room description, <br> and available commands
```
