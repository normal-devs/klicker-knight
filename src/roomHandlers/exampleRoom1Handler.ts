import {
  NarrowedRoomState,
  Command,
  CommandHandler,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';
import { RoomHandler } from './roomHandler';

type TRoomType = 'exampleRoom1';
type TRoomState = NarrowedRoomState<TRoomType>;

const leaveHandler: CommandHandler<TRoomType> = () => ({
  commandDescription: 'You leave example room 1',
  roomState: null,
});

const stateDescriptionAccessor: StateDescriptionAccessor<TRoomState> = {
  AtEntrance: {
    playerStateDescription: 'You are in example room 1',
    availableCommands: ['leave'],
  },
};

export class ExampleRoom1Handler extends RoomHandler<TRoomType> {
  constructor() {
    super(stateDescriptionAccessor);
  }

  createRoomState(): TRoomState {
    return {
      type: 'exampleRoom1',
      playerState: 'AtEntrance',
    };
  }

  protected getCommandHandler(
    roomState: TRoomState,
    command: Command,
  ): NullableCommandHandler<TRoomType> {
    if (command === 'leave') {
      return leaveHandler;
    }

    return null;
  }
}
