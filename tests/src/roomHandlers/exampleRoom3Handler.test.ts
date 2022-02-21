import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { ExampleRoom3Handler } from '../../../src/roomHandlers/exampleRoom3Handler';
import {
  buildStateTransitionHelpers,
  ArrangedTransitionData,
} from '../../testHelpers/buildStateTransitionHelpers';
import { RoomType } from '../../../src/utils/types';

const roomType: RoomType = 'exampleRoom3';
type TRoomType = typeof roomType;
type TArrangedTransitionData = ArrangedTransitionData<TRoomType>;

testSingletonModule(
  'roomHandlers/ExampleRoom3Handler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const {
        testDefaultCommandAtEntrance,
        testInvalidCommandAtEntrance,
        testStateTransition,
      } = buildStateTransitionHelpers(
        testScenario,
        roomType,
        new ExampleRoom3Handler(),
      );

      testDefaultCommandAtEntrance();

      testInvalidCommandAtEntrance();

      testStateTransition(
        'AtEntrance --> State3A: goTo3A',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            laps: 0,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You move to State3A',
            roomState: {
              laps: 0,
            },
          },
        }),
      );

      testStateTransition(
        'State3A --> State3B: goTo3B',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            laps: 0,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You move to State3B',
            roomState: {
              laps: 0,
            },
          },
        }),
      );

      testStateTransition(
        'State3B --> AtEntrance: goToEntrance',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            laps: 2,
          },
          stateAssertionDescription: 'increments the lap count',
          expectedResult: {
            commandDescription: 'You move back to the entrance',
            roomState: {
              laps: 3,
            },
          },
        }),
      );

      testStateTransition('State3B --> [*]: leave', () => ({
        startingRoomState: {
          laps: 0,
        },
        stateAssertionDescription: null,
        expectedResult: {
          commandDescription: 'You leave example room 3',
          roomState: null,
        },
      }));
    });
  },
);
