import {
  NestedPartial,
  schemaToGenerator,
} from '@randograms/schema-to-generator';
import { gameStateSchema } from '../../src/utils/types/gameStateSchema';
import { roomStateSchema } from '../../src/utils/types/roomStateSchema';
import {
  GameState,
  NarrowedRoomState,
  RoomState,
  RoomType,
} from '../../src/utils/types';

export const generateGameState = schemaToGenerator<GameState>(
  gameStateSchema as Record<string, unknown>,
);

export const generateRoomState = schemaToGenerator<RoomState>(roomStateSchema);

export const generateNarrowedRoomState = <TRoomType extends RoomType>(
  override: NestedPartial<NarrowedRoomState<TRoomType>> & { type: TRoomType },
): NarrowedRoomState<TRoomType> =>
  generateRoomState(override) as NarrowedRoomState<TRoomType>;
