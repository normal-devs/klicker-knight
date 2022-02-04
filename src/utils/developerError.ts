export class DeveloperError extends Error {
  constructor(message: string) {
    super(`#blame-jfrog: ${message}`);
  }
}
