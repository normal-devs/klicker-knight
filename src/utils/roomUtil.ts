import { DecisionRoomHandler } from '../roomHandlers/decisionRoomHandler';
import { ExampleRoom1Handler } from '../roomHandlers/exampleRoom1Handler';
import { ExampleRoom2Handler } from '../roomHandlers/exampleRoom2Handler';
import { ExampleRoom3Handler } from '../roomHandlers/exampleRoom3Handler';
import { DeveloperError } from './developerError';
import {
  ROOM_TYPES_TUPLE,
  RoomType,
  AllRoomHandlersByRoomType,
  NarrowedRoomState,
  RoomState,
} from './types';

const allRoomHandlersByRoomType: AllRoomHandlersByRoomType = {
  decisionRoom: new DecisionRoomHandler(),
  exampleRoom1: new ExampleRoom1Handler(),
  exampleRoom2: new ExampleRoom2Handler(),
  exampleRoom3: new ExampleRoom3Handler(),
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

  getRandomRoomHandler: (): AllRoomHandlersByRoomType[RoomType] => {
    const randomIndex = Math.floor(Math.random() * ROOM_TYPES_TUPLE.length);
    const randomRoomType = ROOM_TYPES_TUPLE[randomIndex];

    if (randomRoomType === undefined) {
      throw new DeveloperError(
        'Unreachable. Double check that "randomIndex" will always be valid',
      );
    }

    return roomUtil.getRoomHandlerByRoomType(randomRoomType);
  },

  getRandomInitialRoomState: (): RoomState => {
    return roomUtil.getRandomRoomHandler().createRoomState();
  },

  getRoomHandlerByRoomType: <TRoomType extends RoomType>(
    roomType: TRoomType,
  ): AllRoomHandlersByRoomType[TRoomType] => {
    const roomHandler = allRoomHandlersByRoomType[roomType];
    return roomHandler;
  },
};
