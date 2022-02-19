import { schemaToGenerator } from '@randograms/schema-to-generator';
import gameStateSchema from '../../src/utils/schemas/normalized/gameState.json';
import roomStateSchema from '../../src/utils/schemas/normalized/roomState.json';
import { GameState, RoomState } from '../../src/utils/types';

// TODO: schemaToGenerator cannot handle $refs, so this needs a denormalized schema
export const generateGameState = schemaToGenerator<GameState>(gameStateSchema);

export const generateRoomState = schemaToGenerator<RoomState>(roomStateSchema);
