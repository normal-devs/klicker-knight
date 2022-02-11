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

type OnArrangeAccessor<TRoomType extends RoomType> = () => {
  expectedResult: CommandResult<TRoomType>;
};
type StateTransitionScenarioRegistrant<TRoomType extends RoomType> = (
  mermaidTransition: string,
  onArrange: OnArrangeAccessor<TRoomType>,
) => void;

export const buildTestStateTransition = <TRoomType extends RoomType>(
  testScenario: ScenarioRegistrant,
  roomType: TRoomType,
  roomHandler: RoomHandler<TRoomType>,
): StateTransitionScenarioRegistrant<TRoomType> => {
  const buildScenario: StateTransitionScenarioRegistrant<TRoomType> = (
    mermaidTransition: string,
    onArrange: () => {
      expectedResult: CommandResult<TRoomType>;
    },
  ) => {
    testScenario(mermaidTransition)
      .arrange(() => {
        const { expectedResult } = onArrange();

        const match = mermaidTransition.match(
          /^([^\s]*) --> ([^\s]*): ([^\s]*)$/,
        );

        const [, startingState, endingState, command] = match ?? [
          null,
          null,
          null,
          null,
        ];

        // Validates values instead of "match" to eliminate "undefined" as a possibility
        if (isNil(startingState) || isNil(endingState) || isNil(command)) {
          throw new DeveloperError(
            'Malformed mermaid transition code. Check for extra or missing whitespace, or a deviance from the expected REGEX',
          );
        }

        // deferring type check to data generator schema check
        const override = {
          type: roomType,
          playerState:
            startingState as NarrowedRoomState<TRoomType>['playerState'],
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

  return buildScenario;
};
