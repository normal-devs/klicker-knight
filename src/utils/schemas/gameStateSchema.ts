import gameStateSchemaWithReferences from './gameState.json';

const { definitions } = gameStateSchemaWithReferences;
type Definitions = typeof definitions;

type DefinitionMap = {
  [K in keyof Definitions as `#/definitions/${K}`]: Definitions[K];
};
const map = Object.fromEntries(
  Object.entries(definitions).map(([schemaName, schema]) => [
    `#/definitions/${schemaName}`,
    schema,
  ]),
) as DefinitionMap;

const dereference = (data: unknown): unknown => {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((innerData) => dereference(innerData)) as unknown;
  }

  if ('$ref' in data) {
    const lookupValue = (data as { $ref: unknown }).$ref as keyof DefinitionMap;
    if (!(lookupValue in map)) {
      throw Error(`Bad reference ${lookupValue}`);
    }

    return dereference(map[lookupValue]);
  }

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (key === '$ref' && typeof value === 'string') {
        if (!(value in map)) {
          throw Error(`Bad reference ${value}`);
        }

        return [key, map[value as keyof DefinitionMap]];
      }

      return [key, dereference(value)];
    }),
  );
};

export const gameStateSchema = dereference(gameStateSchemaWithReferences);
