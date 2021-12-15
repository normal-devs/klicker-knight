import type { GameState } from './gameStateSchema';
import { databaseUtil } from './database';

// TODO: replace this with ajv or something: https://github.com/normal-devs/klicker-knight/projects/1#card-74624641
const isGameState = (u: unknown): u is GameState =>
  typeof u === 'object' &&
  u !== null &&
  'currentRoomId' in u &&
  (u as Record<'currentRoomId', any>).currentRoomId === null; // eslint-disable-line @typescript-eslint/no-explicit-any

const init = (): GameState => ({
  currentRoomId: null,
});

export const gameStateUtil = {
  load: (): GameState => {
    const unknownState = databaseUtil.hasGameFile()
      ? databaseUtil.load()
      : null;
    const hasValidSaveState =
      databaseUtil.hasGameFile() && isGameState(unknownState);
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
