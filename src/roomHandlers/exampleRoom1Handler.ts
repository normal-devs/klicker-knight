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
  roomState: null,
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

  createRoomState(): NarrowedRoomState<'exampleRoom1'> {
    return {
      type: 'exampleRoom1',
      playerState: 'AtEntrance',
    };
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
