import { RoomHandler } from './roomHandler';

import {
  Command,
  CommandHandler,
  DEFAULT_COMMAND,
  NarrowedRoomState,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';

type TRoomType = 'exampleRoom2';
type TRoomState = NarrowedRoomState<TRoomType>;
type TPlayerState = TRoomState['playerState'];
type TCommandHandler = CommandHandler<TRoomType>;
type TNullableCommandHandler = NullableCommandHandler<TRoomType>;

const stateDescriptionAccessor: StateDescriptionAccessor<TRoomState> = {
  AtEntrance: {
    playerStateDescription: 'You are in example room 2',
    availableCommands: ['leave', 'goTo2A', 'goTo2B'],
  },
  State2A: {
    playerStateDescription: 'You are in state 2A',
    availableCommands: ['goToEntrance'],
  },
  State2B: {
    playerStateDescription: 'You are in state 2B',
    availableCommands: ['goToEntrance'],
  },
};

const goToEntrance: TCommandHandler = (roomState) => ({
  commandDescription: 'You move back to the entrance',
  roomState: {
    ...roomState,
    playerState: 'AtEntrance',
  },
});

const commandHandlersByCommandByPlayerState: Record<
  TPlayerState,
  Record<string, TNullableCommandHandler>
> = {
  AtEntrance: {
    goTo2A: (roomState) => ({
      commandDescription: 'You move to State2A',
      roomState: {
        ...roomState,
        playerState: 'State2A',
      },
    }),
    goTo2B: (roomState) => ({
      commandDescription: 'You move to State2B',
      roomState: {
        ...roomState,
        playerState: 'State2B',
      },
    }),
    leave: () => ({
      commandDescription: 'You leave example room 2',
      roomState: null,
    }),
  },
  State2A: {
    goToEntrance,
  },
  State2B: {
    goToEntrance,
  },
};

export class ExampleRoom2Handler extends RoomHandler<TRoomType> {
  constructor() {
    super(stateDescriptionAccessor);
  }

  createRoomState(): TRoomState {
    return {
      type: 'exampleRoom2',
      playerState: 'AtEntrance',
    };
  }

  protected getCommandHandler(
    roomState: TRoomState,
    command: Command,
  ): TNullableCommandHandler {
    return command === DEFAULT_COMMAND
      ? null
      : commandHandlersByCommandByPlayerState[roomState.playerState][command] ??
          null;
  }
}
