/* eslint-disable import/no-restricted-paths */
import type { RoomState } from './gameState';
import type { RoomType, NarrowedRoomState } from './roomTypesTuple';
/* eslint-enable import/no-restricted-paths */

import type { RoomHandler } from '../../roomHandlers/roomHandler';

// Game State
export type { GameState, RoomState } from './gameState'; // eslint-disable-line import/no-restricted-paths

export {
  ROOM_TYPES_TUPLE,
  RoomTypesTuple,
  RoomType,
  NarrowedRoomState,
} from './roomTypesTuple'; // eslint-disable-line import/no-restricted-paths

// Game I/O
export type Command = DefaultCommand | string;

export type DefaultCommand = typeof DEFAULT_COMMAND;
export const DEFAULT_COMMAND = Symbol('default command');

export type GameOutput = {
  commandDescription: CommandDescription;
} & RoomStateDescription;

export type CommandDescription = string | null;

export type RoomStateDescription = {
  playerStateDescription: PlayerStateDescription;
  availableCommands: AvailableCommands;
};

export type PlayerStateDescription = string;

export type AvailableCommands = [string, ...string[]];

// RoomHandler and CommandHandler
export type AllRoomHandlersByRoomType = {
  [TRoomType in RoomType]: RoomHandler<TRoomType>;
};

export type StateDescriptionAccessor<TRoomState extends RoomState> = Record<
  TRoomState['playerState'],
  RoomStateDescription | RoomStateDescriptionHandler<TRoomState>
>;

type RoomStateDescriptionHandler<TRoomState extends RoomState> = (
  roomState: TRoomState,
) => RoomStateDescription;

export type CommandHandlersByCommandByPlayerStates<TRoomType extends RoomType> =
  Record<
    NarrowedRoomState<TRoomType>['playerState'],
    Record<string, NullableCommandHandler<TRoomType>>
  >;

export type CommandHandler<TRoomType extends RoomType> = (
  roomState: NarrowedRoomState<TRoomType>,
) => CommandResult<TRoomType>;

export type NullableCommandHandler<TRoomType extends RoomType> =
  CommandHandler<TRoomType> | null;

export type PassthroughCommandHandler = <TRoomType extends RoomType>(
  roomState: NarrowedRoomState<TRoomType>,
) => CommandResult<TRoomType>;

export type CommandResult<TRoomType extends RoomType> = {
  commandDescription: CommandDescription;

  // null indicates the player left the room
  roomState: NarrowedRoomState<TRoomType> | null;
};

// Util
export type ValuesOf<T> = T[keyof T];

export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;
