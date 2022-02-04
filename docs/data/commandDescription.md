# CommandDescription

A CommandDescription is a well formed string explaining the action that the player is taking.

[The game](../architecture/klickerKnight.md) will output the CommandDescription for the current [Command](./command.md)

## DefaultCommandDescription

When the `default` Command is run the game omits the CommandDescription.

## InvalidCommandDescription

If an invalid Command is invoked, the game defaults to "You cannot do that"
