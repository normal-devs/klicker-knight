type Database = {
  hasGameFile: () => boolean;
  load: () => unknown;
  save: (data: any) => void;
};

export const database: Database = {
  hasGameFile: () => true,
  load: () => undefined,
  save: () => undefined,
};
