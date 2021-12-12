import { schemaToGenerator } from '@randograms/schema-to-generator';
import gameStateSchema from '../../src/utils/gameState.schema.json';
import { GameState } from '../../src/utils/gameStateSchema';

export const generateGameState = schemaToGenerator<GameState>(gameStateSchema);
