import { ValuesOf } from './index';
import gameStateSchema from './gameState.schema.json';

export type RoomStateSchema = ValuesOf<
  // The "RoomState" schema is a list of the individual room state schemas, so it can be safely omitted
  Omit<typeof gameStateSchema.definitions, 'RoomState'>
>;

export const roomStateSchema = {
  ...gameStateSchema.definitions.RoomState,
  oneOf: Object.entries(gameStateSchema.definitions)
    .filter(([key]) => key !== 'RoomState')
    .map(([, schema]) => schema) as RoomStateSchema[],
};
