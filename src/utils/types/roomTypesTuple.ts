// THIS FILE WAS AUTOMATICALLY GENERATED
// Use "npm run compile:gameStateSchema" to rebuild

// eslint-disable-next-line import/no-restricted-paths
import {
  ExampleRoom1,
  ExampleRoom2,
  ExampleRoom3,
  RoomceptionRoom,
} from './gameState';

export const ROOM_TYPES_TUPLE = [
  'exampleRoom1',
  'exampleRoom2',
  'exampleRoom3',
  'roomceptionRoom',
] as const;

export type RoomTypesTuple = typeof ROOM_TYPES_TUPLE;

export type RoomType = RoomTypesTuple[number];

export type NarrowedRoomState<TRoomType extends RoomType> =
  TRoomType extends 'exampleRoom1'
    ? ExampleRoom1
    : TRoomType extends 'exampleRoom2'
    ? ExampleRoom2
    : TRoomType extends 'exampleRoom3'
    ? ExampleRoom3
    : TRoomType extends 'roomceptionRoom'
    ? RoomceptionRoom
    : never;
