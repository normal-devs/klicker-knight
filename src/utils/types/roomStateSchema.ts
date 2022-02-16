import { ValuesOf } from './index';
import gameStateSchema from './gameState.schema.json';

// The "RoomState" schema is a list of the individual room state schemas, so it can be safely omitted
type RoomStateDefinitions = Omit<
  typeof gameStateSchema.definitions,
  'RoomState'
>;

export type RoomStateSchema = ValuesOf<RoomStateDefinitions>;

export const roomStateDefinitionNameValueTuples = Object.entries(
  gameStateSchema.definitions,
).filter(([key]) => key !== 'RoomState') as [string, RoomStateSchema][];

export const roomStateSchema = {
  ...gameStateSchema.definitions.RoomState,
  oneOf: roomStateDefinitionNameValueTuples.map(([, schema]) => schema),
};
