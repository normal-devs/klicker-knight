import sinon from 'sinon';
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
          },
          stateAssertionDescription: 'updates the room state',
          expectedResult: {
            commandDescription: 'You fix your fishing line.',
            roomState: {
              fishCaught: 0,
              isRodBroken: false,
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
          },
          stateAssertionDescription: 'does not update the room state',
          expectedResult: {
            commandDescription:
              'You sit down and start to get ready to fish. But your rod is broken and you have to fix it.',
            roomState: {
              fishCaught: 0,
              isRodBroken: true,
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
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'You sit down and start to get ready to fish. This is going to be alot of fun!',
            roomState: {
              fishCaught: 0,
              isRodBroken: false,
            },
          },
        }),
      );

      testStateTransition(
        'Fishing --> Fishing: continue',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: false,
          },
          stateAssertionDescription: 'does not update the room state',
          expectedResult: {
            commandDescription:
              'You continue fishing...\n... but nothing happens',
            roomState: {
              fishCaught: 0,
              isRodBroken: false,
            },
          },
        }),
        {
          onArrange2: () => {
            sinon.stub(Math, 'random').returns(0);
          },
          onAnnihilate: () => {
            sinon.restore();
          },
        },
      );

      testStateTransition(
        'Fishing --> AtEntrance: continue',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: false,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription: `You continue fishing...\n... and you catch a fish!`,
            roomState: {
              fishCaught: 1,
              isRodBroken: false,
            },
          },
        }),
        {
          onArrange2: () => {
            sinon.stub(Math, 'random').returns(0.34);
          },
          onAnnihilate: () => {
            sinon.restore();
          },
        },
      );

      testStateTransition(
        'Fishing --> AtEntrance: continue',
        (): TArrangedTransitionData => ({
          startingRoomState: {
            fishCaught: 0,
            isRodBroken: false,
          },
          stateAssertionDescription: null,
          expectedResult: {
            commandDescription:
              'You continue fishing...\n... but the knot was improperly tied and your line breaks away!',
            roomState: {
              fishCaught: 0,
              isRodBroken: true,
            },
          },
        }),
        {
          onArrange2: () => {
            sinon.stub(Math, 'random').returns(0.67);
          },
          onAnnihilate: () => {
            sinon.restore();
          },
        },
      );
    });
  },
);
