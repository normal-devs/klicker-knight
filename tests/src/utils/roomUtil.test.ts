import { expect } from 'chai';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { roomUtil } from '../../../src/utils/roomUtil';
import { generateGameState } from '../../testHelpers/generateGameState';
import { RoomState } from '../../../src/utils/types';

testSingletonModule('utils/roomUtil', ({ testUnit }) => {
  testUnit('coerceRoomState', ({ testScenario }) => {
    testScenario('when the room state is not null')
      .arrange(() => {
        const mockRoomState = generateGameState().roomState;
        return { mockRoomState };
      })
      .act(({ mockRoomState }) => roomUtil.coerceRoomState(mockRoomState))
      .assert('returns the room state', ({ mockRoomState }, result) => {
        expect(result).to.eq(mockRoomState);
      });

    testScenario('when the room state is null')
      .act(() => roomUtil.coerceRoomState(null))
      .assert('returns a new room state', (arranged, result) => {
        const expectedResult: RoomState = {
          type: 'exampleRoom1',
          playerState: 'AtEntrance',
        };

        expect(result).to.eql(expectedResult);
      });
  });

  testUnit('getRandomRoomHandler', ({ testScenario }) => {
    // TODO: Support retrying a test https://github.com/normal-devs/klicker-knight/issues/26
    testScenario
      .skip('when called multiple times')
      .act(() => [
        roomUtil.getRandomRoomHandler(),
        roomUtil.getRandomRoomHandler(),
      ])
      .assert(
        'sometimes returns different room handlers',
        (arranged, [roomHandler1, roomHandler2]) => {
          expect(roomHandler1).to.not.eq(roomHandler2);
        },
      );
  });
});
