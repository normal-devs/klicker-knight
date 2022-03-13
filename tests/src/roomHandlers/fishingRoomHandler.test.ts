import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { FishingRoomHandler } from '../../../src/roomHandlers/fishingRoomHandler';
import {
  buildStateTransitionHelpers,
  ArrangedTransitionData,
} from '../../testHelpers/buildStateTransitionHelpers';
import { RoomType } from '../../../src/utils/types';

const roomType: RoomType = 'fishingRoom';
type TRoomType = typeof roomType;
type TArrangedTransitionData = ArrangedTransitionData<TRoomType>;

testSingletonModule(
  'roomHandlers/FishingRoomHandler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      const {
        testDefaultCommandAtEntrance,
        testInvalidCommandAtEntrance,
        testStateTransition,
      } = buildStateTransitionHelpers(
        testScenario,
        roomType,
        new FishingRoomHandler(),
      );

      testDefaultCommandAtEntrance();

      testInvalidCommandAtEntrance();
    });
  },
);
