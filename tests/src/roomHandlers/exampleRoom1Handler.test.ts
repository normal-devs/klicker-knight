import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { ExampleRoom1Handler } from '../../../src/roomHandlers/exampleRoom1Handler';
import {
  ArrangedTransitionData,
  buildStateTransitionHelpers,
} from '../../testHelpers/buildStateTransitionHelpers';

const roomType = 'exampleRoom1';
type TRoomType = typeof roomType;
type TArrangedTransitionData = ArrangedTransitionData<TRoomType>;

testSingletonModule(
  'roomHandlers/ExampleRoom1Handler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const {
        testDefaultCommandAtEntrance,
        testInvalidCommandAtEntrance,
        testStateTransition,
      } = buildStateTransitionHelpers(
        testScenario,
        roomType,
        new ExampleRoom1Handler(),
      );

      testDefaultCommandAtEntrance();

      testInvalidCommandAtEntrance();

      testStateTransition(
        'AtEntrance --> [*]: leave',
        (): TArrangedTransitionData => ({
          startingRoomState: {},
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You leave example room 1',
            roomState: null,
          },
        }),
      );
    });
  },
);
