import { DeveloperError } from '../../src/utils/developerError';

/**
 * For testing the errors that an errorable function throws
 * @param errorableWrapper An anonymous function that wraps the function under test: () => { foo(); }
 * @returns The error thrown by the wrapped function call
 * @throws If the wrapped function throws a non-error
 */
export const tryErrorable = (errorableWrapper: () => void): Error | null => {
  try {
    errorableWrapper();
    return null;
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new DeveloperError(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Expected function to throw an instance of Error, but got: ${error}`,
      );
    }
    return error;
  }
};
