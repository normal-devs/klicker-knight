import {
  NarrowedRoomState,
  Command,
  CommandHandler,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';
import { RoomHandler } from './roomHandler';

const roomType = 'exampleRoom1';
type TRoomType = typeof roomType;
type TRoomState = NarrowedRoomState<TRoomType>;
type TStateDescriptionAccessor = StateDescriptionAccessor<TRoomState>;
type TCommandHandler = CommandHandler<TRoomType>;
type TNullableCommandHandler = NullableCommandHandler<TRoomType>;

const leaveHandler: TCommandHandler = () => ({
  commandDescription: 'You leave example room 1',
  roomState: null,
});

const stateDescriptionAccessor: TStateDescriptionAccessor = {
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
      type: roomType,
      playerState: 'AtEntrance',
    };
  }

  protected getCommandHandler(
    roomState: TRoomState,
    command: Command,
  ): TNullableCommandHandler {
    if (command === 'leave') {
      return leaveHandler;
    }

    return null;
  }
}
