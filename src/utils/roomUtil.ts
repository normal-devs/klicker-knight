import { ExampleRoom1Handler } from '../roomHandlers/exampleRoom1Handler';
import { RoomHandler } from '../roomHandlers/roomHandler';
import { DeveloperError } from './developerError';
import {
  ROOM_TYPES_TUPLE,
  RoomType,
  AllRoomHandlersByRoomType,
  NarrowedRoomState,
  RoomState,
} from './types';

const allRoomHandlersByRoomType: AllRoomHandlersByRoomType = {
  exampleRoom1: new ExampleRoom1Handler(),
};

export const roomUtil = {
  coerceRoomState: <TRoomType extends RoomType>(
    roomState: NarrowedRoomState<TRoomType> | null,
  ): RoomState => {
    if (roomState !== null) {
      return roomState;
    }

    const roomHandler = roomUtil.getRandomRoomHandler();
    return roomHandler.createRoomState();
  },

  getRandomRoomHandler: (): RoomHandler<RoomType> => {
    const randomIndex = Math.floor(Math.random() * ROOM_TYPES_TUPLE.length);
    const randomRoomType = ROOM_TYPES_TUPLE[randomIndex];

    if (randomRoomType === undefined) {
      throw new DeveloperError('Unreachable');
    }

    return roomUtil.getRoomHandlerByRoomType(randomRoomType);
  },

  getRandomRoomState: (): RoomState => {
    return roomUtil.getRandomRoomHandler().createRoomState();
  },

  getRoomHandlerByRoomType: (roomType: RoomType): RoomHandler<RoomType> => {
    return allRoomHandlersByRoomType[roomType];
  },
};
