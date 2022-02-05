/**
 * For testing the errors that an errorable function throws
 * @param errorableWrapper An anonymous function that wraps the function under test: () => { foo(); }
 * @returns The error thrown by the wrapped function call
 * @throws If the wrapped function throws a non-error
 */
export declare const tryErrorable: (errorableWrapper: () => void) => Error | null;
