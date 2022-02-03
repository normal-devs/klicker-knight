import Ajv from 'ajv';
import type { GameState } from './types';
import { databaseUtil } from './databaseUtil';
import gameStateSchema from './types/gameState.schema.json';
import { DeveloperError } from './developerError';

const ajv = new Ajv();
const validateGameState = ajv.compile(gameStateSchema);

const isGameState = (unknownState: unknown): unknownState is GameState =>
  validateGameState(unknownState);

const init = (): GameState => ({
  currentRoomId: null,
});

export const gameStateUtil = {
  load: (): GameState => {
    const unknownState = databaseUtil.load();
    const hasValidSaveState = isGameState(unknownState);
    const gameState = hasValidSaveState ? unknownState : init();

    if (!hasValidSaveState) {
      gameStateUtil.save(gameState);
    }

    return gameState;
  },
  save: (state: object): void => {
    if (isGameState(state)) {
      databaseUtil.save(state);
      return;
    }

    throw new DeveloperError(
      'Attempted to save an invalid game state. Did you forget to compile the game state schema?',
    );
  },
};
