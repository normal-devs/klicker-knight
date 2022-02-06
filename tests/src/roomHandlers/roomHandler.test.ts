/* eslint-disable class-methods-use-this */

import { expect } from 'chai';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { RoomHandler } from '../../../src/roomHandlers/roomHandler';
import {
  CommandHandler,
  RoomState,
  PassthroughCommandHandler,
  StateDescriptionAccessor,
  CommandResult,
  DEFAULT_COMMAND,
} from '../../../src/utils/types';
import { INVALID_COMMAND } from '../../testHelpers/invalidCommand';

type TTestRoomType = 'exampleRoom1';

testSingletonModule('roomHandlers/RoomHandler', ({ testUnit }) => {
  testUnit('run', ({ testScenario }) => {
    abstract class BaseTestRoomHandler extends RoomHandler<TTestRoomType> {
      constructor() {
        const unusedAccessor: StateDescriptionAccessor<TTestRoomType> = {
          AtEntrance: {
            playerStateDescription: '',
            availableCommands: [''],
          },
        };

        super(unusedAccessor);
      }
    }

    testScenario('when the subclass returns a CommandHandler')
      .arrange(() => {
        const commandHandler: PassthroughCommandHandler = (roomState) => ({
          commandDescription: 'Mock command description',
          roomState,
        });

        class TestRoomHandler extends BaseTestRoomHandler {
          protected getCommandHandler(): CommandHandler<TTestRoomType> {
            return commandHandler;
          }
        }

        const roomHandler = new TestRoomHandler();
        const inputRoomState: RoomState = {
          type: 'exampleRoom1',
          playerState: 'AtEntrance',
        };
        return { roomHandler, inputRoomState };
      })
      .act(({ inputRoomState, roomHandler }) => {
        return roomHandler.run(inputRoomState, '');
      })
      .assert(
        'returns the result from the custom CommandHandler',
        ({ inputRoomState }, result) => {
          const expectedResult: CommandResult<TTestRoomType> = {
            commandDescription: 'Mock command description',
            roomState: inputRoomState,
          };

          expect(result).to.eql(expectedResult);
        },
      );

    testScenario(
      'when the subclass does not return a CommandHandler and the command is the default command',
    )
      .arrange(() => {
        class TestRoomHandler extends BaseTestRoomHandler {
          protected getCommandHandler(): null {
            return null;
          }
        }

        const roomHandler = new TestRoomHandler();
        const inputRoomState: RoomState = {
          type: 'exampleRoom1',
          playerState: 'AtEntrance',
        };
        return { roomHandler, inputRoomState };
      })
      .act(({ inputRoomState, roomHandler }) => {
        return roomHandler.run(inputRoomState, DEFAULT_COMMAND);
      })
      .assert(
        'returns the result from the default command handler',
        ({ inputRoomState }, result) => {
          const expectedResult: CommandResult<TTestRoomType> = {
            commandDescription: null,
            roomState: inputRoomState,
          };

          expect(result).to.eql(expectedResult);
        },
      );

    testScenario(
      'when the subclass does not return a CommandHandler and the command is the default command',
    )
      .arrange(() => {
        class TestRoomHandler extends BaseTestRoomHandler {
          protected getCommandHandler(): null {
            return null;
          }
        }

        const roomHandler = new TestRoomHandler();
        const inputRoomState: RoomState = {
          type: 'exampleRoom1',
          playerState: 'AtEntrance',
        };
        return { roomHandler, inputRoomState };
      })
      .act(({ inputRoomState, roomHandler }) => {
        return roomHandler.run(inputRoomState, INVALID_COMMAND);
      })
      .assert(
        'returns the result from the invalid command handler',
        ({ inputRoomState }, result) => {
          const expectedResult: CommandResult<TTestRoomType> = {
            commandDescription: 'You cannot do that',
            roomState: inputRoomState,
          };

          expect(result).to.eql(expectedResult);
        },
      );
  });
});
