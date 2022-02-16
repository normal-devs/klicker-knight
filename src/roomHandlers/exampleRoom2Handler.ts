import { RoomHandler } from './roomHandler';

import {
  Command,
  NarrowedRoomState,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';

const roomType = 'exampleRoom2';
type TRoomType = typeof roomType;
type TRoomState = NarrowedRoomState<TRoomType>;
type TStateDescriptionAccessor = StateDescriptionAccessor<TRoomState>;
type TNullableCommandHandler = NullableCommandHandler<TRoomType>;

const stateDescriptionAccessor: TStateDescriptionAccessor = {
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

export class ExampleRoom2Handler extends RoomHandler<TRoomType> {
  constructor() {
    super(stateDescriptionAccessor);
  }

  createRoomState(): TRoomState {
    return {
      type: roomType,
      playerState: 'AtEntrance',
    };
  }

  protected getCommandHandler(
    roomState: TRoomState,
    command: Command,
  ): TNullableCommandHandler {
    if (command === 'leave') {
      return () => ({
        commandDescription: 'You leave example room 2',
        roomState: null,
      });
    }

    return null;
  }
}
