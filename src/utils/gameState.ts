import type { GameState } from './gameStateSchema';
import { database } from './database';

// TODO: replace this with ajv or something: https://github.com/normal-devs/klicker-knight/projects/1#card-74624641
const isGameState = (u: unknown): u is GameState =>
  typeof u === 'object' &&
  u !== null &&
  'currentRoomId' in u &&
  (u as Record<'currentRoomId', any>).currentRoomId === null;

const init = (): GameState => ({
  currentRoomId: null,
});

export const gameStateUtil = {
  load: (): GameState => {
    const unknownState = database.hasGameFile() ? database.load() : null;
    const hasValidSaveState =
      database.hasGameFile() && isGameState(unknownState);
    const gameState = hasValidSaveState ? unknownState : init();

    if (!hasValidSaveState) {
      gameStateUtil.save(gameState);
    }

    return gameState;
  },
  save: (state: GameState) => {
    database.save(state);
  },
};
