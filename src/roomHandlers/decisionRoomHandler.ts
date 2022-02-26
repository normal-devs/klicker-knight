import { RoomHandler } from './roomHandler';

import {
  Command,
  CommandHandlersByCommandByPlayerStates,
  DEFAULT_COMMAND,
  NarrowedRoomState,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';

const roomType = 'decisionRoom';
type TRoomType = typeof roomType;
type TRoomState = NarrowedRoomState<TRoomType>;
type TStateDescriptionAccessor = StateDescriptionAccessor<TRoomState>;
type TCommandHandlersByCommandByPlayerStates =
  CommandHandlersByCommandByPlayerStates<TRoomType>;
type TNullableCommandHandler = NullableCommandHandler<TRoomType>;

const stateDescriptionAccessor: TStateDescriptionAccessor = {
  AtEntrance: {
    playerStateDescription:
      'You see two doors and decide you should take the door on the left.',
    availableCommands: ['leaveLeft', 'leaveRight'],
  },
  AttemptingToLeave: {
    playerStateDescription:
      'You are walking down a long hallway. There is a sharp turn to the left up ahead.',
    availableCommands: ['continue'],
  },
};

const commandHandlersByCommandByPlayerState: TCommandHandlersByCommandByPlayerStates =
  {
    AtEntrance: {
      leaveLeft: (roomState) => ({
        commandDescription: roomState.isSheeple
          ? 'As decided, you exit via the door on the left.'
          : 'As originally intended, you exit via the door on the left.',
        roomState: null,
      }),
      leaveRight: (roomState) => ({
        commandDescription: roomState.isSheeple
          ? 'Interestingly enough, you change your mind and exit via the door on the right.'
          : 'Despite your better judgement, you continue through the door on the right.',
        roomState: {
          ...roomState,
          playerState: 'AttemptingToLeave',
          isSheeple: false,
        },
      }),
    },
    AttemptingToLeave: {
      continue: (roomState) => ({
        commandDescription: 'You round the corner of the long hallway.',
        roomState: {
          ...roomState,
          playerState: 'AtEntrance',
        },
      }),
    },
  };

export class DecisionRoomHandler extends RoomHandler<TRoomType> {
  constructor() {
    super(stateDescriptionAccessor);
  }

  createRoomState(): TRoomState {
    return {
      type: roomType,
      playerState: 'AtEntrance',
      isSheeple: true,
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
