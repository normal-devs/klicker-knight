import { schemaToGenerator } from '@randograms/schema-to-generator';
import { gameStateSchema } from '../../src/utils/types/gameStateSchema';
import { roomStateSchema } from '../../src/utils/types/roomStateSchema';
import { GameState, RoomState } from '../../src/utils/types';

export const generateGameState = schemaToGenerator<GameState>(
  gameStateSchema as Record<string, unknown>,
);

export const generateRoomState = schemaToGenerator<RoomState>(roomStateSchema);
