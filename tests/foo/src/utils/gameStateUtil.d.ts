import type { GameState } from './types';
export declare const gameStateUtil: {
    load: () => GameState;
    save: (state: unknown) => void;
};
