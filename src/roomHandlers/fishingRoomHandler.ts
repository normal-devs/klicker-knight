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
  AtEntrance: ({ fishCaught, isRodBroken }) => {
    const poleText = isRodBroken ? 'broken' : 'working';

    return {
      playerStateDescription: `You are on a dock with a ${poleText} fishing pole. You have caught ${fishCaught} fish so far!`,
      availableCommands: ['fish', 'fix', 'leave'],
    };
  },
  Fishing: {
    playerStateDescription: 'Hopefully the fish are hungry today.',
    availableCommands: ['stop', 'fish'],
  },
};

const commandHandlersByCommandByPlayerState: TCommandHandlersByCommandByPlayerStates =
  {
    AtEntrance: {
      fish: (roomState) => ({
        commandDescription: `You sit down and start to get ready to fish. ${
          roomState.isRodBroken
            ? 'But your rod is broken and you have to fix it.'
            : 'This is going to be alot of fun!'
        }`,
        roomState: {
          ...roomState,
          playerState: roomState.isRodBroken ? 'AtEntrance' : 'Fishing',
        },
      }),
      fix: (roomState) => ({
        commandDescription: 'You fix your fishing line.',
        roomState: {
          ...roomState,
          playerState: 'AtEntrance',
          isRodBroken: false,
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
        commandDescription: `You cast your fishing line. ${
          roomState.randomNumber === 0
            ? 'And nothing happen, maybe try again?'
            : 'And something happen!'
        }`,
        roomState: {
          ...roomState,
          playerState: roomState.randomNumber === 0 ? 'Fishing' : 'AtEntrance',
          fishCaught:
            roomState.randomNumber === 1
              ? roomState.fishCaught + 1
              : roomState.fishCaught,
          isRodBroken: roomState.randomNumber === 2,
          randomNumber: Math.floor(Math.random() * 3),
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
      isRodBroken: false,
      fishCaught: 0,
      randomNumber: Math.floor(Math.random() * 3),
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
