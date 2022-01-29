import { schemaToGenerator } from '@randograms/schema-to-generator';
import gameStateSchema from '../../src/utils/types/gameState.schema.json';
import { GameState } from '../../src/utils/types';

export const generateGameState = schemaToGenerator<GameState>(gameStateSchema);
