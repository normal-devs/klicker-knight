import {
  NarrowedRoomState,
  Command,
  CommandHandler,
  NullableCommandHandler,
  StateDescriptionAccessor,
} from '../utils/types';
import { RoomHandler } from './roomHandler';

const roomType = 'roomceptionRoom';
type TRoomType = typeof roomType;
type TRoomState = NarrowedRoomState<TRoomType>;
type TStateDescriptionAccessor = StateDescriptionAccessor<TRoomState>;
type TCommandHandler = CommandHandler<TRoomType>;
type TNullableCommandHandler = NullableCommandHandler<TRoomType>;

const stateDescriptionAccessor: TStateDescriptionAccessor = {
  AtEntrance: {
    playerStateDescription: 'You are in a hallway with a lone door.',
    availableCommands: ['explore', 'leave'],
  },
};

const exploreHandler: TCommandHandler = (roomState) => ({
  commandDescription:
    'You wander the lengths of the hallway only to return to where you started.',
  roomState,
});

const leaveHandler: TCommandHandler = () => ({
  commandDescription: 'You leave through the only available door.',
  roomState: null,
});

export class RoomceptionRoomHandler extends RoomHandler<TRoomType> {
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
    if (command === 'explore') {
      return exploreHandler;
    }

    if (command === 'leave') {
      return leaveHandler;
    }

    return null;
  }
}
