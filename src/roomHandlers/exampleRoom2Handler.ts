import { RoomHandler } from './roomHandler';

import {
  Command,
  NarrowedRoomState,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';

type TRoomType = 'exampleRoom2';
type TRoomState = NarrowedRoomState<TRoomType>;
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
    if (command === 'leave') {
      return () => ({
        commandDescription: 'You leave example room 2',
        roomState: null,
      });
    }

    return null;
  }
}
