import { expect } from 'chai';
import { ScenarioRegistrant } from '../../semantic-mocha/src';
import { RoomHandler } from '../../src/roomHandlers/roomHandler';
import { DeveloperError } from '../../src/utils/developerError';
import {
  CommandResult,
  DEFAULT_COMMAND,
  NarrowedRoomState,
  RoomType,
  isNil,
} from '../../src/utils/types';
import {
  generateNarrowedRoomState,
  NarrowedRoomStateOverride,
} from './generateGameState';
import { INVALID_COMMAND } from './invalidCommand';

type StateTransitionHelpers<TRoomType extends RoomType> = {
  testDefaultCommandAtEntrance: () => void;
  testInvalidCommandAtEntrance: () => void;
  testStateTransition: StateTransitionScenarioRegistrant<TRoomType>;
};

type StateTransitionScenarioRegistrant<TRoomType extends RoomType> = (
  mermaidTransition: string,
  onArrange: OnArrangeAccessor<TRoomType>,
) => void;

type OnArrangeAccessor<TRoomType extends RoomType> =
  () => ArrangedTransitionData<TRoomType>;

export type ArrangedTransitionData<TRoomType extends RoomType> = {
  startingRoomState: OmitKnownKeys<TRoomType>;
  stateAssertionDescription: string | null;
  expectedResult: {
    commandDescription: Exclude<
      CommandResult<TRoomType>['commandDescription'],
      null
    >;
    roomState: null | OmitKnownKeys<TRoomType>;
  };
};

const EXIT_CODE = '[*]';

// Have to exclude room states that only have "type" and "playerState" or they become "any"
type OmitKnownKeys<TRoomType extends RoomType> = TRoomType extends
  | 'exampleRoom1'
  | 'exampleRoom2'
  | 'roomceptionRoom'
  ? Record<string, never>
  : Omit<NarrowedRoomState<TRoomType>, 'type' | 'playerState'>;

const getStateAssertionDescription = (
  isExitTransition: boolean,
  isPlayerStateTransition: boolean,
  inputStateAssertionDescription: string | null,
): string => {
  const isInputAString = typeof inputStateAssertionDescription === 'string';
  const isInputNull = inputStateAssertionDescription === null;
  const isInputEmptyString = inputStateAssertionDescription === '';

  if (isExitTransition) {
    if (isInputAString) {
      throw new DeveloperError(
        '"stateAssertionDescription" must be null for an exit transition',
      );
    }

    return 'clears the room state';
  }

  if (isPlayerStateTransition) {
    if (isInputEmptyString) {
      throw new DeveloperError(
        '"stateAssertionDescription" must be null or non-empty for a player state transition',
      );
    }

    if (isInputNull) {
      return 'updates the player state';
    }

    return `updates the player state and ${inputStateAssertionDescription}`;
  }

  if (isInputNull || isInputEmptyString) {
    throw new DeveloperError(
      '"stateAssertionDescription" must be non-empty if the player state did not change',
    );
  }

  return inputStateAssertionDescription;
};

export const buildStateTransitionHelpers = <TRoomType extends RoomType>(
  testScenario: ScenarioRegistrant,
  roomType: TRoomType,
  roomHandler: RoomHandler<TRoomType>,
): StateTransitionHelpers<TRoomType> => {
  const testStateTransition: StateTransitionScenarioRegistrant<TRoomType> = (
    mermaidTransition: string,
    onArrange: OnArrangeAccessor<TRoomType>,
  ) => {
    const match = mermaidTransition.match(/^([^\s]*) --> ([^\s]*): ([^\s]*)$/);

    const [, startingPlayerState, endingPlayerState, command] = match ?? [
      null,
      null,
      null,
      null,
    ];

    const isExitTransition = endingPlayerState === EXIT_CODE;
    const isPlayerStateTransition = endingPlayerState !== startingPlayerState;

    let arrangeResult: ArrangedTransitionData<TRoomType> | null;
    let stateAssertionDescription: string | null;
    let arrangeError: unknown = null;
    try {
      arrangeResult = onArrange();
      stateAssertionDescription = getStateAssertionDescription(
        isExitTransition,
        isPlayerStateTransition,
        arrangeResult.stateAssertionDescription,
      );
    } catch (error) {
      arrangeResult = null;
      stateAssertionDescription = null;
      arrangeError = error;
    }

    testScenario(mermaidTransition)
      .arrange(() => {
        // Validates values instead of "match" to eliminate "undefined" as a possibility
        if (
          isNil(startingPlayerState) ||
          isNil(endingPlayerState) ||
          isNil(command)
        ) {
          throw new DeveloperError(
            'Malformed mermaid transition code. Check for extra or missing whitespace, or a deviance from the expected REGEX',
          );
        }

        if (arrangeResult === null) {
          throw arrangeError;
        }

        const { startingRoomState, expectedResult: partialExpectedResult } =
          arrangeResult;

        // deferring type check to data generator schema check
        const inputRoomStateOverride = {
          ...startingRoomState,
          type: roomType,
          playerState: startingPlayerState,
        } as unknown as NarrowedRoomStateOverride<TRoomType>;

        const inputRoomState = generateNarrowedRoomState<TRoomType>(
          inputRoomStateOverride,
        );

        let expectedRoomState: CommandResult<TRoomType>['roomState'];
        if (partialExpectedResult.roomState !== null && isExitTransition) {
          throw new DeveloperError(
            '"expectedResult.roomState" must be null when testing an exit transition',
          );
        }

        if (partialExpectedResult.roomState === null && !isExitTransition) {
          throw new DeveloperError(
            '"expectedResult.roomState" cannot be null when testing an inner-room transition',
          );
        }

        if (partialExpectedResult.roomState === null) {
          expectedRoomState = partialExpectedResult.roomState;
        } else {
          // deferring type check to data generator schema check
          const expectedRoomStateOverride = {
            ...partialExpectedResult.roomState,
            type: roomType,
            playerState: endingPlayerState,
          } as unknown as NarrowedRoomStateOverride<TRoomType>;

          expectedRoomState = generateNarrowedRoomState<TRoomType>(
            expectedRoomStateOverride,
          );
        }

        const expectedResult: CommandResult<TRoomType> = {
          commandDescription: partialExpectedResult.commandDescription,
          roomState: expectedRoomState,
        };

        if (Object.keys(expectedResult).length !== 2) {
          throw new DeveloperError(
            'Unexpected number of keys on "CommandResult". Update this test to have one assertion per key',
          );
        }

        return { inputRoomState, expectedResult, inputCommand: command };
      })
      .act(({ inputRoomState, inputCommand }) =>
        roomHandler.run(inputRoomState, inputCommand),
      )
      .assert(
        arrangeResult === null
          ? 'ARRANGE_ERROR'
          : `outputs: "${arrangeResult.expectedResult.commandDescription}"`,
        ({ expectedResult }, result) => {
          expect(result.commandDescription).to.eql(
            expectedResult.commandDescription,
          );
        },
      )
      .assert(
        stateAssertionDescription === null
          ? 'ARRANGE_ERROR'
          : stateAssertionDescription,
        ({ expectedResult }, result) => {
          expect(result.roomState).to.eql(expectedResult.roomState);
        },
      );
  };

  const generateRoomStateAtEntrance = () =>
    generateNarrowedRoomState({
      type: roomType,
      playerState: 'AtEntrance',
    } as unknown as NarrowedRoomStateOverride<TRoomType>);

  const testDefaultCommandAtEntrance = () => {
    testScenario('with the default command at the entrance')
      .arrange(() => {
        const inputRoomState = generateRoomStateAtEntrance();
        return { inputRoomState };
      })
      .act(({ inputRoomState }) =>
        roomHandler.run(inputRoomState, DEFAULT_COMMAND),
      )
      .assert(
        'returns the input room state and no command description',
        ({ inputRoomState }, result) => {
          const expectedResult: CommandResult<TRoomType> = {
            commandDescription: null,
            roomState: inputRoomState,
          };

          expect(result).to.eql(expectedResult);
          expect(result.roomState).to.eq(inputRoomState);
        },
      );
  };

  const testInvalidCommandAtEntrance = () => {
    testScenario('with an invalid command at the entrance')
      .arrange(() => {
        const inputRoomState = generateRoomStateAtEntrance();
        return { inputRoomState };
      })
      .act(({ inputRoomState }) =>
        roomHandler.run(inputRoomState, INVALID_COMMAND),
      )
      .assert(
        'returns the input room state with the invalid command description',
        ({ inputRoomState }, result) => {
          const expectedResult: CommandResult<TRoomType> = {
            commandDescription: 'You cannot do that',
            roomState: inputRoomState,
          };

          expect(result).to.eql(expectedResult);
          expect(result.roomState).to.eq(inputRoomState);
        },
      );
  };

  return {
    testDefaultCommandAtEntrance,
    testInvalidCommandAtEntrance,
    testStateTransition,
  };
};
