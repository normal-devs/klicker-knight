import Ajv from 'ajv';
import type { GameState } from './types';
import { databaseUtil } from './databaseUtil';
import gameStateSchema from './schemas/normalized/gameState.json';
import { DeveloperError } from './developerError';
import { roomUtil } from './roomUtil';

// TODO: ajv can't resolve the relative refs, so this needs a denormalized schema
const ajv = new Ajv();
const validateGameState = ajv.compile(gameStateSchema);

const isGameState = (unknownState: unknown): unknownState is GameState =>
  validateGameState(unknownState);

const init = (): GameState => {
  const newGameState: GameState = {
    roomState: roomUtil.getRandomInitialRoomState(),
  };

  return newGameState;
};

export const gameStateUtil = {
  load: (): GameState => {
    const { data: unknownState } = databaseUtil.load();
    const hasValidSaveState = isGameState(unknownState);
    const gameState = hasValidSaveState ? unknownState : init();

    if (!hasValidSaveState) {
      gameStateUtil.save(gameState);
    }

    return gameState;
  },
  save: (state: unknown): void => {
    if (!isGameState(state)) {
      throw new DeveloperError(
        'Attempted to save an invalid game state. Did you forget to compile the game state schema?',
      );
    }

    const { isSaved } = databaseUtil.save(state);
    if (!isSaved) {
      throw new DeveloperError('Database failed to save the game state.');
    }
  },
};
