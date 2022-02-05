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
  // delete(): DeleteResult {
  //   try {
  //     fs.unlinkSync(defaultFilePath);
  //     return {
  //       isFileOnDisk: false,
  //       error: null,
  //     };
  //   } catch (error) {
  //     return {
  //       isFileOnDisk: databaseUtil.hasGameFile(),
  //       error,
  //     };
  //   }
  // },
  delete(): DeleteResult {
    try {
      fs.unlinkSync(defaultFilePath);
      console.log('ITS FINE');

      return {
        isFileOnDisk: false,
        error: null,
      };
    } catch (error) {
      console.log('ERROR');
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
      const data = fs.readFileSync(defaultFilePath, 'utf-8');

      return {
        data: JSON.parse(data),
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
      fs.writeFileSync(defaultFilePath, JSON.stringify(data));
      return {
        isSaved: true,
        error: null,
      };
    } catch (error) {
      return {
        isSaved: false,
        error: null,
      };
    }
  },
};
