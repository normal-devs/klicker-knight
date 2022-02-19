import { schemaToGenerator } from '@randograms/schema-to-generator';
import gameStateSchema from '../../src/utils/schemas/denormalized/gameState.json';
import roomStateSchema from '../../src/utils/schemas/denormalized/roomState.json';
import { GameState, RoomState } from '../../src/utils/types';

export const generateGameState = schemaToGenerator<GameState>(gameStateSchema);

export const generateRoomState = schemaToGenerator<RoomState>(roomStateSchema);
