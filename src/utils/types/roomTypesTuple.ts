// THIS FILE WAS AUTOMATICALLY GENERATED
// Use "npm run compile:gameStateSchema" to rebuild

import {
  ExampleRoom1,
  ExampleRoom2,
  ExampleRoom3,
  // eslint-disable-next-line import/no-restricted-paths
} from './gameState';

export const ROOM_TYPES_TUPLE = [
  'exampleRoom1',
  'exampleRoom2',
  'exampleRoom3',
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
    : never;
