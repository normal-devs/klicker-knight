import fs from 'fs';
import gameStateSchema from '../src/utils/types/gameState.schema.json';

type ValuesOf<T> = T[keyof T];

type ReusableSchemasCollection = typeof gameStateSchema.definitions;

// The "RoomState" schema is a list of the individual room state schemas, so it can be safely omitted
type RoomStateSchema = ValuesOf<Omit<ReusableSchemasCollection, 'RoomState'>>;

const roomTypes = Object.values(gameStateSchema.definitions)
  .filter((schema): schema is RoomStateSchema => 'properties' in schema)
  .map((schema) => schema.properties.type.const);

const outputRoomTypeList = roomTypes
  .map((roomType) => `'${roomType}'`)
  .join(`\n  `);

const output = [
  '// THIS FILE WAS AUTOMATICALLY GENERATED',
  '// Use "npm run compile:gameStateSchema" to rebuild',
  '',
  `export const ROOM_TYPES_TUPLE = [${outputRoomTypeList}] as const;`,
  '',
].join('\n');

fs.writeFileSync('src/utils/types/roomTypesTuple.ts', output);
