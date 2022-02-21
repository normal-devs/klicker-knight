import fs from 'fs';
import { roomStateDefinitionNameValueTuples } from '../src/utils/types/roomStateSchema';

const schemaTypeScriptTypes = roomStateDefinitionNameValueTuples.map(
  ([schemaName, schema]) => ({
    roomStateTypeIdentifier: schemaName,
    roomTypeType: `'${schema.properties.type.const}'`,
  }),
);

const typeScriptTypeImports = schemaTypeScriptTypes.map(
  ({ roomStateTypeIdentifier }) => `  ${roomStateTypeIdentifier},`,
);

const roomTypeTypes: string[] = schemaTypeScriptTypes.map(
  ({ roomTypeType }) => roomTypeType,
);

const output = [
  '// THIS FILE WAS AUTOMATICALLY GENERATED',
  '// Use "npm run compile:gameStateSchema" to rebuild',
  '',
  'import {',
  ...typeScriptTypeImports,
  '  // eslint-disable-next-line import/no-restricted-paths',
  "} from './gameState';",
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
