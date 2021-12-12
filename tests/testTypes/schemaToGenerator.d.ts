declare module '@randograms/schema-to-generator' {
  // Returns a type where every nested object of T has optional keys
  type NestedPartial<T> = T extends Array<infer T2>
    ? NestedPartial<T2>[]
    : T extends Record<string, any>
    ? { [K in keyof T]?: NestedPartial<T[K]> }
    : T;

  type DataGenerator<T> = (override?: NestedPartial<T>) => T;

  export const schemaToGenerator: <T>(
    schema: Record<string, any>
  ) => DataGenerator<T>;
}
