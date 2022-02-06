import { expect } from 'chai';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { ExampleRoom1Handler } from '../../../src/roomHandlers/exampleRoom1Handler';
import { CommandResult, RoomState } from '../../../src/utils/types';

testSingletonModule(
  'roomHandlers/ExampleRoom1Handler',
  ({ testIntegration }) => {
    testIntegration('run', ({ testScenario }) => {
      testScenario('with the "leave" command')
        .arrange(() => {
          const roomHandler = new ExampleRoom1Handler();
          const inputRoomState: RoomState = {
            type: 'exampleRoom1',
            playerState: 'AtEntrance',
          };
          return { roomHandler, inputRoomState };
        })
        .act(({ roomHandler, inputRoomState }) =>
          roomHandler.run(inputRoomState, 'leave'),
        )
        .assert('returns the leave result', ({ inputRoomState }, result) => {
          const expectedResult: CommandResult<'exampleRoom1'> = {
            commandDescription: 'You leave example room 1',
            roomState: inputRoomState,
          };

          expect(result).to.eql(expectedResult);
        });
    });
  },
);
