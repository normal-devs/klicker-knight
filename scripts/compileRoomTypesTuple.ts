import fs from 'fs';
import roomStateSchema from '../src/utils/schemas/normalized/roomState.json';

// TODO: Make this dynamic after solving how to denormalize the schema
const schemaTypeScriptTypes = roomStateSchema.oneOf.map(
  (referenceSchema, index) => ({
    roomStateTypeIdentifier: `ExampleRoom${index + 1}`,
    roomTypeType: `'exampleRoom${index + 1}'`,
  }),
);

const typeScriptTypeImportList = schemaTypeScriptTypes
  .map(({ roomStateTypeIdentifier }) => roomStateTypeIdentifier)
  .join(', ');

const roomTypeTypes: string[] = schemaTypeScriptTypes.map(
  ({ roomTypeType }) => roomTypeType,
);

const output = [
  '// THIS FILE WAS AUTOMATICALLY GENERATED',
  '// Use "npm run compile:gameStateSchema" to rebuild',
  '',
  '// eslint-disable-next-line import/no-restricted-paths',
  `import { ${typeScriptTypeImportList} } from './gameState';`,
  '',
  'export const ROOM_TYPES_TUPLE = [',
  ...roomTypeTypes.map((roomTypeType) => `  ${roomTypeType},`),
  '] as const;',
  '',
  'export type RoomTypesTuple = typeof ROOM_TYPES_TUPLE;',
  '',
  'export type RoomType = RoomTypesTuple[number];',
  '',
  'export type NarrowedRoomState<TRoomType extends RoomType> =',
  ...schemaTypeScriptTypes.map(
    ({ roomStateTypeIdentifier, roomTypeType }) =>
      `  TRoomType extends ${roomTypeType} ? ${roomStateTypeIdentifier} :`,
  ),
  '  never;',
].join('\n');

fs.writeFileSync('src/utils/types/roomTypesTuple.ts', output);
