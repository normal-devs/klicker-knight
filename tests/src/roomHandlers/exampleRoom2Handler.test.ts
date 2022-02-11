import { expect } from 'chai';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { ExampleRoom2Handler } from '../../../src/roomHandlers/exampleRoom2Handler';
import { CommandResult, NarrowedRoomState } from '../../../src/utils/types';
import { DeveloperError } from '../../../src/utils/developerError';
import { generateNarrowedRoomState } from '../../testHelpers/generateGameState';

type TRoomType = 'exampleRoom2';
type TRoomState = NarrowedRoomState<TRoomType>;
type TCommandResult = CommandResult<TRoomType>;
const exampleRoom2Handler = new ExampleRoom2Handler();

const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

testSingletonModule(
  'roomHandlers/ExampleRoom2Handler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const testStateTransition = (
        mermaidTransition: string,
        onArrange: () => {
          expectedResult: TCommandResult;
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
                'Malformed mermaid transition code. Check for extra or missing whitespace',
              );
            }

            const inputRoomState: TRoomState =
              generateNarrowedRoomState<TRoomType>({
                type: 'exampleRoom2',

                // deferring type check to data generator schema check
                playerState: startingState as TRoomState['playerState'],
              });
            return { inputRoomState, command, expectedResult };
          })
          .act(({ inputRoomState, command }) =>
            exampleRoom2Handler.run(inputRoomState, command),
          )
          .assert('returns a CommandResult', ({ expectedResult }, result) => {
            expect(result).to.eql(expectedResult);
          });
      };

      testStateTransition('AtEntrance --> State2A: goTo2A', () => ({
        expectedResult: {
          commandDescription: 'You move to State2A',
          roomState: {
            type: 'exampleRoom2',
            playerState: 'State2A',
          },
        },
      }));

      testStateTransition('AtEntrance --> State2B: goTo2B', () => ({
        expectedResult: {
          commandDescription: 'You move to State2B',
          roomState: {
            type: 'exampleRoom2',
            playerState: 'State2B',
          },
        },
      }));

      testStateTransition('AtEntrance --> [*]: leave', () => ({
        expectedResult: {
          commandDescription: 'You leave example room 2',
          roomState: null,
        },
      }));

      testStateTransition('State2A --> AtEntrance: goToEntrance', () => ({
        expectedResult: {
          commandDescription: 'You move back to the entrance',
          roomState: {
            type: 'exampleRoom2',
            playerState: 'AtEntrance',
          },
        },
      }));

      testStateTransition('State2B --> AtEntrance: goToEntrance', () => ({
        expectedResult: {
          commandDescription: 'You move back to the entrance',
          roomState: {
            type: 'exampleRoom2',
            playerState: 'AtEntrance',
          },
        },
      }));
    });
  },
);
