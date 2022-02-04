# Command

A Command is an action that a player can take in a [Room](./room.md) and is represented as a string.
If the player does not invoke [the game](../architecture/klickerKnight.md) with a Command,
then the game defaults to the `default` Command.
When the `default` Command is applied, the game outputs the description
of the current [PlayerState](./playerState.md).

When the player invokes any other Command, the game outputs a Command description
that depends on the [RoomState](./roomState.md) (and consequently the PlayerState).
