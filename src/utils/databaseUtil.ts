import fs from 'fs';

export const defaultFilePath = 'saves/data.json';

export const databaseUtil = {
  delete(): boolean {
    try {
      fs.unlinkSync(defaultFilePath);
      return true;
    } catch (error) {
      return false;
    }
  },

  hasGameFile(): boolean {
    return fs.existsSync(defaultFilePath);
  },

  load(): unknown {
    try {
      const data = fs.readFileSync(defaultFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  },

  save(data: unknown): boolean {
    try {
      fs.writeFileSync(defaultFilePath, JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  },
};
