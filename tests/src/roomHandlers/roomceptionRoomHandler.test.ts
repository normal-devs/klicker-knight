import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { RoomceptionRoomHandler } from '../../../src/roomHandlers/roomceptionRoomHandler';
import {
  ArrangedTransitionData,
  buildStateTransitionHelpers,
} from '../../testHelpers/buildStateTransitionHelpers';

const roomType = 'roomceptionRoom';
type TRoomType = typeof roomType;
type TArrangedTransitionData = ArrangedTransitionData<TRoomType>;

testSingletonModule(
  'roomHandlers/RoomceptionRoomHandler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const {
        testDefaultCommandAtEntrance,
        testInvalidCommandAtEntrance,
        testStateTransition,
      } = buildStateTransitionHelpers(
        testScenario,
        roomType,
        new RoomceptionRoomHandler(),
      );

      testDefaultCommandAtEntrance();

      testInvalidCommandAtEntrance();

      testStateTransition(
        'AtEntrance --> AtEntrance: explore',
        (): TArrangedTransitionData => ({
          startingRoomState: {},
          stateAssertionDescription: 'does not update the room state',
          expectedResult: {
            commandDescription:
              'You wander the lengths of the hallway only to return to where you started.',
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
            commandDescription: 'You leave through the only available door.',
            roomState: null,
          },
        }),
      );
    });
  },
);
