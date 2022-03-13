import { RoomHandler } from './roomHandler';

import {
  Command,
  CommandHandlersByCommandByPlayerStates,
  DEFAULT_COMMAND,
  NarrowedRoomState,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';

const roomType = 'fishingRoom';
type TRoomType = typeof roomType;
type TRoomState = NarrowedRoomState<TRoomType>;
type TStateDescriptionAccessor = StateDescriptionAccessor<TRoomState>;
type TCommandHandlersByCommandByPlayerStates =
  CommandHandlersByCommandByPlayerStates<TRoomType>;
type TNullableCommandHandler = NullableCommandHandler<TRoomType>;

const stateDescriptionAccessor: TStateDescriptionAccessor = {
  AtEntrance: ({ fishCaught, brokenRod }) => {
    const poleText = brokenRod === true ? 'broken' : 'working';

    return {
      playerStateDescription: `You are on a dock with a ${poleText} fishing pole. You have caught ${fishCaught} fish so far!`,
      availableCommands: ['fish', 'leave'],
    };
  },
  Fishing: {
    playerStateDescription: 'Hopefully the fish are hungry today.',
    availableCommands: ['stop', 'fish'],
  },
  Caught: {
    playerStateDescription: 'Congratulations!!! You caught a fish!!!',
    availableCommands: ['goToEntrance'],
  },
  BrokenLine: {
    playerStateDescription:
      'You have a broken fishing line and the fish got away.',
    availableCommands: ['stop', 'fix'],
  },
};

const commandHandlersByCommandByPlayerState: TCommandHandlersByCommandByPlayerStates =
  {
    AtEntrance: {
      fish: (roomState) => ({
        commandDescription: 'You start to fish.',
        roomState: {
          ...roomState,
          playerState: roomState.brokenRod === true ? 'BrokenLine' : 'Fishing',
        },
      }),
      leave: () => ({
        commandDescription: 'You say goodbye to the fish and leave.',
        roomState: null,
      }),
    },
    Fishing: {
      stop: (roomState) => ({
        commandDescription: 'You stop fishing.',
        roomState: {
          ...roomState,
          playerState: 'AtEntrance',
        },
      }),
      fish: (roomState) => ({
        commandDescription: 'You cast your fishing line.',
        roomState: {
          ...roomState,
          playerState: Math.random() > 0.5 ? 'Caught' : 'BrokenLine',
        },
      }),
    },
    Caught: {
      goToEntrance: (roomState) => ({
        commandDescription: 'You at back on the dock.',
        roomState: {
          ...roomState,
          playerState: 'AtEntrance',
          fishCaught: roomState.fishCaught + 1,
        },
      }),
    },
    BrokenLine: {
      stop: (roomState) => ({
        commandDescription: 'You stop fishing.',
        roomState: {
          ...roomState,
          playerState: 'AtEntrance',
          brokenRod: true,
        },
      }),
      fix: (roomState) => ({
        commandDescription: 'You fix your fishing line.',
        roomState: {
          ...roomState,
          playerState: 'AtEntrance',
          brokenRod: false,
        },
      }),
    },
  };

export class FishingRoomHandler extends RoomHandler<TRoomType> {
  constructor() {
    super(stateDescriptionAccessor);
  }

  createRoomState(): TRoomState {
    return {
      type: 'fishingRoom',
      playerState: 'AtEntrance',
      brokenRod: false,
      fishCaught: 0,
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
