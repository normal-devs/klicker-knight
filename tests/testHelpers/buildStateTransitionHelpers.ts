import { expect } from 'chai';
import { ScenarioRegistrant } from '../../semantic-mocha/src';
import { RoomHandler } from '../../src/roomHandlers/roomHandler';
import { DeveloperError } from '../../src/utils/developerError';
import {
  CommandResult,
  NarrowedRoomState,
  RoomType,
} from '../../src/utils/types';
import {
  generateNarrowedRoomState,
  NarrowedRoomStateOverride,
} from './generateGameState';

const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

type StateTransitionHelpers<TRoomType extends RoomType> = {
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
  expectedResult: {
    commandDescription: CommandResult<TRoomType>['commandDescription'];
    roomState: null | OmitKnownKeys<TRoomType>;
  };
};

const EXIT_CODE = '[*]';

// Have to exclude room states that only have "type" and "playerState" or they become "any"
type OmitKnownKeys<TRoomType extends RoomType> = TRoomType extends
  | 'exampleRoom1'
  | 'exampleRoom2'
  ? Record<string, never>
  : Omit<NarrowedRoomState<TRoomType>, 'type' | 'playerState'>;

export const buildStateTransitionHelpers = <TRoomType extends RoomType>(
  testScenario: ScenarioRegistrant,
  roomType: TRoomType,
  roomHandler: RoomHandler<TRoomType>,
): StateTransitionHelpers<TRoomType> => {
  const testStateTransition: StateTransitionScenarioRegistrant<TRoomType> = (
    mermaidTransition: string,
    onArrange: OnArrangeAccessor<TRoomType>,
  ) => {
    testScenario(mermaidTransition)
      .arrange(() => {
        const match = mermaidTransition.match(
          /^([^\s]*) --> ([^\s]*): ([^\s]*)$/,
        );

        const [, startingPlayerState, endingPlayerState, command] = match ?? [
          null,
          null,
          null,
          null,
        ];

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

        const { startingRoomState, expectedResult: partialExpectedResult } =
          onArrange();

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
        if (
          partialExpectedResult.roomState !== null &&
          endingPlayerState === EXIT_CODE
        ) {
          throw new DeveloperError(
            '"expectedResult.roomState" must be null when testing an exit transition',
          );
        }

        if (
          partialExpectedResult.roomState === null &&
          endingPlayerState !== EXIT_CODE
        ) {
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

        return { inputRoomState, command, expectedResult };
      })
      .act(({ inputRoomState, command }) =>
        roomHandler.run(inputRoomState, command),
      )
      .assert('returns a CommandResult', ({ expectedResult }, result) => {
        expect(result).to.eql(expectedResult);
      });
  };

  return {
    testStateTransition,
  };
};
