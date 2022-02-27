import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { DecisionRoomHandler } from '../../../src/roomHandlers/decisionRoomHandler';
import {
  buildStateTransitionHelpers,
  ArrangedTransitionData,
} from '../../testHelpers/buildStateTransitionHelpers';
import { RoomType } from '../../../src/utils/types';

const roomType: RoomType = 'decisionRoom';
type TRoomType = typeof roomType;
type TArrangedTransitionData = ArrangedTransitionData<TRoomType>;

testSingletonModule(
  'roomHandlers/DecisionRoomHandler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const {
        testDefaultCommandAtEntrance,
        testInvalidCommandAtEntrance,
        testStateTransition,
      } = buildStateTransitionHelpers(
        testScenario,
        roomType,
        new DecisionRoomHandler(),
      );

      testDefaultCommandAtEntrance();

      testInvalidCommandAtEntrance();

      testStateTransition(
        'AtEntrance --> [*]: leaveLeft',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            isSheeple: true,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'As decided, you exit via the door on the left.',
            roomState: null,
          },
        }),
      );

      testStateTransition(
        'AtEntrance --> [*]: leaveLeft',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            isSheeple: false,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'As originally intended, you exit via the door on the left.',
            roomState: null,
          },
        }),
      );

      testStateTransition(
        'AtEntrance --> AttemptingToLeave: leaveRight',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            isSheeple: true,
          },
          stateAssertionDescription: 'updates isSheeple',
          expectedResult: {
            commandDescription:
              'Interestingly enough, you change your mind and exit via the door on the right.',
            roomState: {
              isSheeple: false,
            },
          },
        }),
      );

      testStateTransition(
        'AtEntrance --> AttemptingToLeave: leaveRight',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            isSheeple: false,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'Despite your better judgement, you continue through the door on the right.',
            roomState: {
              isSheeple: false,
            },
          },
        }),
      );

      testStateTransition(
        'AttemptingToLeave --> AtEntrance: continue',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            isSheeple: false,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: 'You round the corner of the long hallway.',
            roomState: {
              isSheeple: false,
            },
          },
        }),
      );
    });
  },
);
