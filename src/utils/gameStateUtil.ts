import type { GameState } from './types';
import { databaseUtil } from './databaseUtil';

// TODO: replace this with ajv or something: https://github.com/normal-devs/klicker-knight/projects/1#card-74624641
const isGameState = (unknownState: unknown): unknownState is GameState =>
  typeof unknownState === 'object' &&
  unknownState !== null &&
  'currentRoomId' in unknownState &&
  (unknownState as Record<'currentRoomId', any>).currentRoomId === null; // eslint-disable-line @typescript-eslint/no-explicit-any

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
