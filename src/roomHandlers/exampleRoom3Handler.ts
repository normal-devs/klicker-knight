import { RoomHandler } from './roomHandler';

import {
  Command,
  CommandHandlersByCommandByPlayerStates,
  DEFAULT_COMMAND,
  NarrowedRoomState,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';

const roomType = 'exampleRoom3';
type TRoomType = typeof roomType;
type TRoomState = NarrowedRoomState<TRoomType>;
type TStateDescriptionAccessor = StateDescriptionAccessor<TRoomState>;
type TCommandHandlersByCommandByPlayerStates =
  CommandHandlersByCommandByPlayerStates<TRoomType>;
type TNullableCommandHandler = NullableCommandHandler<TRoomType>;

const stateDescriptionAccessor: TStateDescriptionAccessor = {
  AtEntrance: ({ laps }) => {
    const lapsText = laps === 1 ? 'lap' : 'laps';

    return {
      playerStateDescription: `You are at the entrance of example room 3 and have completed ${laps} ${lapsText}`,
      availableCommands: ['goTo3A'],
    };
  },
  State3A: {
    playerStateDescription: 'You are in state 3A',
    availableCommands: ['goTo3B'],
  },
  State3B: {
    playerStateDescription: 'You are in state 3B',
    availableCommands: ['goToEntrance', 'leave'],
  },
};

const commandHandlersByCommandByPlayerState: TCommandHandlersByCommandByPlayerStates =
  {
    AtEntrance: {
      goTo3A: (roomState) => ({
        commandDescription: 'You move to State3A',
        roomState: {
          ...roomState,
          playerState: 'State3A',
        },
      }),
    },
    State3A: {
      goTo3B: (roomState) => ({
        commandDescription: 'You move to State3B',
        roomState: {
          ...roomState,
          playerState: 'State3B',
        },
      }),
    },
    State3B: {
      goToEntrance: (roomState) => ({
        commandDescription: 'You move back to the entrance',
        roomState: {
          ...roomState,
          playerState: 'AtEntrance',
          laps: roomState.laps + 1,
        },
      }),
      leave: () => ({
        commandDescription: 'You leave example room 3',
        roomState: null,
      }),
    },
  };

export class ExampleRoom3Handler extends RoomHandler<TRoomType> {
  constructor() {
    super(stateDescriptionAccessor);
  }

  createRoomState(): TRoomState {
    return {
      type: 'exampleRoom3',
      playerState: 'AtEntrance',
      laps: 0,
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
