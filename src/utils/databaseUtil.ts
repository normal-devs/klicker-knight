import fs from 'fs';

export const defaultFilePath = 'saves/data.json';

export type LoadResult =
  | {
      data: unknown;
      error: null;
    }
  | {
      data: null;
      error: unknown;
    };

export type SaveResult =
  | {
      isSaved: true;
      error: null;
    }
  | {
      isSaved: false;
      error: unknown;
    };

export type DeleteResult =
  | {
      isFileOnDisk: false;
      error: null;
    }
  | {
      isFileOnDisk: boolean;
      error: unknown;
    };

export const databaseUtil = {
  delete(): DeleteResult {
    try {
      fs.unlinkSync(defaultFilePath);

      return {
        isFileOnDisk: false,
        error: null,
      };
    } catch (error) {
      return {
        isFileOnDisk: databaseUtil.hasGameFile(),
        error,
      };
    }
  },

  hasGameFile(): boolean {
    return fs.existsSync(defaultFilePath);
  },

  load(): LoadResult {
    try {
      const serializedData = fs.readFileSync(defaultFilePath, 'utf-8');
      const data: unknown = JSON.parse(serializedData);

      return {
        data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error,
      };
    }
  },

  save(data: unknown): SaveResult {
    try {
      const serializedData = JSON.stringify(data);
      fs.writeFileSync(defaultFilePath, serializedData);

      return {
        isSaved: true,
        error: null,
      };
    } catch (error) {
      return {
        isSaved: false,
        error,
      };
    }
  },
};
