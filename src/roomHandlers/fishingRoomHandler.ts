import { RoomHandler } from './roomHandler';

import {
  Command,
  CommandHandlersByCommandByPlayerStates,
  CommandResult,
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

    const availableCommands: [string, ...string[]] = ['fish', 'leave'];
    if (isRodBroken) availableCommands.push('fix');

    return {
      playerStateDescription: `You are on a dock with a ${poleText} fishing pole. You have caught ${fishCaught} fish so far!`,
      availableCommands,
    };
  },
  Fishing: {
    playerStateDescription: 'Hopefully the fish are hungry today.',
    availableCommands: ['stop', 'continue'],
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
      continue: (roomState) => {
        const randomNumber = Math.floor(Math.random() * 3);

        const transition = (
          {
            0: 'NONE',
            1: 'CATCH',
            2: 'BREAK',
          } as const
        )[randomNumber as 0 | 1 | 2];

        const result: CommandResult<TRoomType> = {
          commandDescription: `You continue fishing...
        ${transition === 'NONE' ? '... but nothing happens' : ''}
        ${transition === 'CATCH' ? '... and you catch a fish!' : ''}
        ${
          transition === 'BREAK'
            ? '.. but the knot was improperly tied and your line breaks away!'
            : ''
        }`,
          roomState: {
            ...roomState,
            playerState: transition === 'NONE' ? 'Fishing' : 'AtEntrance',
            fishCaught:
              transition === 'CATCH'
                ? roomState.fishCaught + 1
                : roomState.fishCaught,
            isRodBroken: transition === 'BREAK',
          },
        };

        return result;
      },
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
