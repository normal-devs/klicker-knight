import Ajv from 'ajv';
import type { GameState } from './types';
import { databaseUtil } from './databaseUtil';
import gameStateSchema from './types/gameState.schema.json';

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
  save: (state: GameState): void => {
    databaseUtil.save(state);
  },
};
