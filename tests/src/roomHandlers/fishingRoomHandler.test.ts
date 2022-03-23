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

      testStateTransition(
        'AtEntrance --> AtEntrance: fix',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: true,
            randomNumber: 0,
          },
          stateAssertionDescription: 'updates the room state',
          expectedResult: {
            commandDescription: 'You fix your fishing line.',
            roomState: {
              fishCaught: 0,
              isRodBroken: false,
              randomNumber: 0,
            },
          },
        }),
      );

      testStateTransition(
        'AtEntrance --> AtEntrance: fish',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: true,
            randomNumber: 0,
          },
          stateAssertionDescription: 'does not update the room state',
          expectedResult: {
            commandDescription:
              'You sit down and start to get ready to fish. But your rod is broken and you have to fix it.',
            roomState: {
              fishCaught: 0,
              isRodBroken: true,
              randomNumber: 0,
            },
          },
        }),
      );

      testStateTransition(
        'AtEntrance --> Fishing: fish',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: false,
            randomNumber: 0,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'You sit down and start to get ready to fish. This is going to be alot of fun!',
            roomState: {
              fishCaught: 0,
              isRodBroken: false,
              randomNumber: 0,
            },
          },
        }),
      );

      testStateTransition(
        'Fishing --> Fishing: fish',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: false,
            randomNumber: 0,
          },
          stateAssertionDescription: 'does not update the room state',
          expectedResult: {
            commandDescription:
              'You cast your fishing line. And nothing happen, maybe try again?',
            roomState: {
              fishCaught: 0,
              isRodBroken: false,
              randomNumber: 0,
            },
          },
        }),
      );

      testStateTransition(
        'Fishing --> AtEntrance: fish',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: false,
            randomNumber: 1,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'You cast your fishing line. And something happen!',
            roomState: {
              fishCaught: 1,
              isRodBroken: false,
              randomNumber: 0,
            },
          },
        }),
      );

      testStateTransition(
        'Fishing --> AtEntrance: fish',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: false,
            randomNumber: 2,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'You cast your fishing line. And something happen!',
            roomState: {
              fishCaught: 0,
              isRodBroken: true,
              randomNumber: 0,
            },
          },
        }),
      );
    });
  },
);
