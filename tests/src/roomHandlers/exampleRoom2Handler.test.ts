import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { ExampleRoom2Handler } from '../../../src/roomHandlers/exampleRoom2Handler';
import {
  buildStateTransitionHelpers,
  ArrangedTransitionData,
} from '../../testHelpers/buildStateTransitionHelpers';

const roomType = 'exampleRoom2';
type TRoomType = typeof roomType;
type TArrangedTransitionData = ArrangedTransitionData<TRoomType>;

testSingletonModule(
  'roomHandlers/ExampleRoom2Handler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const {
        testDefaultCommandAtEntrance,
        testInvalidCommandAtEntrance,
        testStateTransition,
      } = buildStateTransitionHelpers(
        testScenario,
        roomType,
        new ExampleRoom2Handler(),
      );

      testDefaultCommandAtEntrance();

      testInvalidCommandAtEntrance();

      testStateTransition(
        'AtEntrance --> State2A: goTo2A',
        (): TArrangedTransitionData => ({
          startingRoomState: {},
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You move to State2A',
            roomState: {},
          },
        }),
      );

      testStateTransition(
        'AtEntrance --> State2B: goTo2B',
        (): TArrangedTransitionData => ({
          startingRoomState: {},
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You move to State2B',
            roomState: {},
          },
        }),
      );

      testStateTransition(
        'AtEntrance --> [*]: leave',
        (): TArrangedTransitionData => ({
          startingRoomState: {},
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You leave example room 2',
            roomState: null,
          },
        }),
      );

      testStateTransition(
        'State2A --> AtEntrance: goToEntrance',
        (): TArrangedTransitionData => ({
          startingRoomState: {},
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You move back to the entrance',
            roomState: {},
          },
        }),
      );

      testStateTransition(
        'State2B --> AtEntrance: goToEntrance',
        (): TArrangedTransitionData => ({
          startingRoomState: {},
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You move back to the entrance',
            roomState: {},
          },
        }),
      );
    });
  },
);
