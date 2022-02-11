import {
  DEFAULT_COMMAND,
  CommandResult,
  RoomType,
  NarrowedRoomState,
  Command,
  PassthroughCommandHandler,
  NullableCommandHandler,
  RoomStateDescription,
  StateDescriptionAccessor,
} from '../utils/types';

const defaultCommandHandler: PassthroughCommandHandler = (roomState) => ({
  commandDescription: null,
  roomState,
});

const invalidCommandHandler: PassthroughCommandHandler = (roomState) => ({
  commandDescription: 'You cannot do that',
  roomState,
});

export abstract class RoomHandler<TRoomType extends RoomType> {
  constructor(
    private stateDescriptionAccessor: StateDescriptionAccessor<
      NarrowedRoomState<TRoomType>
    >,
  ) {}

  abstract createRoomState(): NarrowedRoomState<TRoomType>;

  run(
    roomState: NarrowedRoomState<TRoomType>,
    command: Command,
  ): CommandResult<TRoomType> {
    let commandHandler: NullableCommandHandler<TRoomType> =
      this.getCommandHandler(roomState, command);

    if (commandHandler === null && command === DEFAULT_COMMAND) {
      commandHandler = defaultCommandHandler;
    } else if (commandHandler === null) {
      commandHandler = invalidCommandHandler;
    }

    return commandHandler(roomState);
  }

  protected abstract getCommandHandler(
    roomState: NarrowedRoomState<TRoomType>,
    command: Command,
  ): NullableCommandHandler<TRoomType>;

  getRoomStateDescription(
    roomState: NarrowedRoomState<TRoomType>,
  ): RoomStateDescription {
    return this.stateDescriptionAccessor[
      roomState.playerState as NarrowedRoomState<TRoomType>['playerState']
    ];
  }
}
