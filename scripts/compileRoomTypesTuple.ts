import fs from 'fs';
import { roomStateSchema } from '../src/utils/types/roomStateSchema';

const roomTypes: string[] = roomStateSchema.oneOf.map(
  (schema) => schema.properties.type.const,
);

const output = [
  '// THIS FILE WAS AUTOMATICALLY GENERATED',
  '// Use "npm run compile:gameStateSchema" to rebuild',
  '',
  'export const ROOM_TYPES_TUPLE = [',
  ...roomTypes.map((roomType) => `  '${roomType}',`),
  '] as const;',
].join('\n');

fs.writeFileSync('src/utils/types/roomTypesTuple.ts', output);
