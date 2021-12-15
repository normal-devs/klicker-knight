const { existsSync, readFileSync, writeFileSync, unlinkSync } = require('fs');

const defaultFilePath = 'saves/data.json';

module.exports = {
  hasGameFile(): boolean {
    if (existsSync(defaultFilePath)) return true;
    return false;
  },

  load(): unknown {
    try {
      const data = readFileSync(defaultFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return { error };
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
