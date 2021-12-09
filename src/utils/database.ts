import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';

export class Database {
  defaultFilePath: string;

  constructor() {
    this.defaultFilePath = 'saves/data.json';
  }

  async hasGameFile(filePathOverride?: string): Promise<boolean> {
    return existsSync(filePathOverride || this.defaultFilePath);
  }

  async load(filePathOverride?: string): Promise<object> {
    try {
      const data = await readFileSync(
        filePathOverride || this.defaultFilePath,
        'utf-8'
      );
      return JSON.parse(data);
    } catch (error) {
      return { error };
    }
  }

  async save(data: object, filePathOverride?: string): Promise<void> {
    return writeFileSync(
      filePathOverride || this.defaultFilePath,
      JSON.stringify(data)
    );
  }

  async delete(filePathOverride?: string): Promise<void> {
    try {
      return unlinkSync(filePathOverride || this.defaultFilePath);
    } catch (error) {
      return undefined;
    }
  }
}
