import {
  NarrowedRoomState,
  Command,
  CommandHandler,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';
import { RoomHandler } from './roomHandler';

type TRoomType = 'exampleRoom1';

const leaveHandler: CommandHandler<TRoomType> = () => ({
  commandDescription: 'You leave example room 1',

  // TODO: move new room initialization to a RoomHandler instance function
  roomState: {
    type: 'exampleRoom1',
    playerState: 'AtEntrance',
  },
});

const stateDescriptionAccessor: StateDescriptionAccessor<TRoomType> = {
  AtEntrance: {
    playerStateDescription: 'You are in example room 1',
    availableCommands: ['leave'],
  },
};

export class ExampleRoom1Handler extends RoomHandler<TRoomType> {
  constructor() {
    super(stateDescriptionAccessor);
  }

  protected getCommandHandler(
    roomState: NarrowedRoomState<TRoomType>,
    command: Command,
  ): NullableCommandHandler<TRoomType> {
    if (command === 'leave') {
      return leaveHandler;
    }

    return null;
  }
}
