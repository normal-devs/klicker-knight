import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';

export class Database {
  defaultFilePath: string;

  constructor() {
    this.defaultFilePath = 'saves/data.json';
  }

  hasGameFile(filePathOverride?: string): any {
    return existsSync(filePathOverride || this.defaultFilePath);
  }

  load(filePathOverride?: string): unknown {
    try {
      const data = readFileSync(
        filePathOverride || this.defaultFilePath,
        'utf-8'
      );
      return JSON.parse(data);
    } catch (error) {
      return { error };
    }
  }

  save(data: object, filePathOverride?: string): void {
    return writeFileSync(
      filePathOverride || this.defaultFilePath,
      JSON.stringify(data)
    );
  }

  delete(filePathOverride?: string): void {
    try {
      return unlinkSync(filePathOverride || this.defaultFilePath);
    } catch (error) {
      return undefined;
    }
  }
}
