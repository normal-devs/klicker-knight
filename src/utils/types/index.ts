/* eslint-disable import/no-restricted-paths */
import type { RoomState } from './gameState';
import type { ROOM_TYPES_TUPLE } from './roomTypesTuple';
/* eslint-enable import/no-restricted-paths */

// Game State
export type { GameState, RoomState, ExampleRoom1 } from './gameState'; // eslint-disable-line import/no-restricted-paths

// eslint-disable-next-line import/no-restricted-paths
export { ROOM_TYPES_TUPLE } from './roomTypesTuple';
export type RoomTypesTuple = typeof ROOM_TYPES_TUPLE;
export type RoomType = RoomTypesTuple[number];

export type NarrowedRoomState<TRoomType extends RoomType> = RoomState & {
  type: TRoomType;
};

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
export type StateDescriptionAccessor<TRoomType extends RoomType> = Record<
  NarrowedRoomState<TRoomType>['playerState'],
  RoomStateDescription
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
  roomState: NarrowedRoomState<TRoomType>;
};
