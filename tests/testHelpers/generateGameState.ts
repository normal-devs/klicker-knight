import { schemaToGenerator } from '@randograms/schema-to-generator';
import gameStateSchema from '../../src/utils/types/gameState.schema.json';
import { roomStateSchema } from '../../src/utils/types/roomStateSchema';
import { GameState, RoomState } from '../../src/utils/types';

export const generateGameState = schemaToGenerator<GameState>(gameStateSchema);

export const generateRoomState = schemaToGenerator<RoomState>(roomStateSchema);
