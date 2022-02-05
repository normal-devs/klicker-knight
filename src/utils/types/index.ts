// eslint-disable-next-line import/no-restricted-paths
export type { GameState } from './gameState';

// Game I/O
export type Command = DefaultCommand | string;

export type DefaultCommand = typeof DEFAULT_COMMAND;
export const DEFAULT_COMMAND = Symbol('default command');

export type GameOutput = {
  commandDescription: CommandDescription;
  playerStateDescription: PlayerStateDescription;
  availableCommands: AvailableCommands;
};

export type CommandDescription = string | null;

export type PlayerStateDescription = string;

export type AvailableCommands = [string, ...string[]];
