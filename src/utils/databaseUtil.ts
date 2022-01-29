import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';

const defaultFilePath = 'saves/data.json';

export const databaseUtil = {
  hasGameFile(): boolean {
    return existsSync(defaultFilePath);
  },

  load(): unknown {
    try {
      const data = readFileSync(defaultFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  },

  save(data: object): boolean {
    try {
      writeFileSync(defaultFilePath, JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  },

  delete(): boolean {
    try {
      unlinkSync(defaultFilePath);
      return true;
    } catch (error) {
      return false;
    }
  },
};