import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { ExampleRoom2Handler } from '../../../src/roomHandlers/exampleRoom2Handler';
import { buildStateTransitionHelpers } from '../../testHelpers/buildStateTransitionHelpers';

testSingletonModule(
  'roomHandlers/ExampleRoom2Handler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const { testStateTransition } = buildStateTransitionHelpers(
        testScenario,
        'exampleRoom2',
        new ExampleRoom2Handler(),
      );

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
