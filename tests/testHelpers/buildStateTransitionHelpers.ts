import { expect } from 'chai';
import { ScenarioRegistrant } from '../../semantic-mocha/src';
import { RoomHandler } from '../../src/roomHandlers/roomHandler';
import { DeveloperError } from '../../src/utils/developerError';
import { CommandResult, RoomType } from '../../src/utils/types';
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

type OnArrangeAccessor<TRoomType extends RoomType> = () => {
  expectedResult: CommandResult<TRoomType>;
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

        const { expectedResult } = onArrange();

        // deferring type check to data generator schema check
        const override = {
          type: roomType,
          playerState: startingPlayerState,
        } as unknown as NarrowedRoomStateOverride<TRoomType>;

        const inputRoomState = generateNarrowedRoomState<TRoomType>(override);

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
