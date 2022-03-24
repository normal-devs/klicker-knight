import { RoomHandler } from './roomHandler';

import {
  AvailableCommands,
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

    const availableCommands: AvailableCommands = ['fish', 'leave'];
    if (isRodBroken) availableCommands.push('fix');

    return {
      playerStateDescription: `You are on a dock with a ${poleText} fishing pole. You have caught ${fishCaught} fish so far!`,
      availableCommands,
    };
  },
  Fishing: {
    playerStateDescription:
      'Your line is cast, hopefully the fish are hungry today.',
    availableCommands: ['stop', 'continue'],
  },
};

const commandHandlersByCommandByPlayerState: TCommandHandlersByCommandByPlayerStates =
  {
    AtEntrance: {
      fish: (roomState) => {
        const commandDescription = `You sit down and start to get ready to fish. ${
          roomState.isRodBroken
            ? 'But your rod is broken and you have to fix it.'
            : 'This is going to be alot of fun!'
        }`;
        const playerState = roomState.isRodBroken ? 'AtEntrance' : 'Fishing';

        let nextRoomState: TRoomState;
        if (playerState === 'Fishing') {
          nextRoomState = {
            ...roomState,
            isRodBroken: false,
            playerState: 'Fishing',
          };
        } else {
          nextRoomState = {
            ...roomState,
            isRodBroken: true,
            playerState: 'AtEntrance',
          };
        }

        return { commandDescription, roomState: nextRoomState };
      },
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

        const commandDescription: string = [
          ['You continue fishing...', true],
          ['... but nothing happens', transition === 'NONE'],
          ['... and you catch a fish!', transition === 'CATCH'],
          // eslint-disable-next-line prettier/prettier
          ['... but the knot was improperly tied and your line breaks away!', transition === 'BREAK'],
        ]
          .filter(([, isShown]) => isShown)
          .map(([line]) => line)
          .join('\n');

        const playerState = transition === 'NONE' ? 'Fishing' : 'AtEntrance';

        let nextRoomState: TRoomState;
        if (playerState === 'Fishing') {
          nextRoomState = {
            ...roomState,
            playerState,
            isRodBroken: false,
          };
        } else {
          nextRoomState = {
            ...roomState,
            playerState,
            fishCaught:
              transition === 'CATCH'
                ? roomState.fishCaught + 1
                : roomState.fishCaught,
            isRodBroken: transition === 'BREAK',
          };
        }

        return {
          commandDescription,
          roomState: nextRoomState,
        };
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
