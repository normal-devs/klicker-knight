import { gameStateUtil } from './gameStateUtil';
import { roomUtil } from './roomUtil';
import { Command, GameOutput, GameState } from './types';

export const gameUtil = {
  run: (command: Command): GameOutput => {
    // Load State
    const gameState = gameStateUtil.load();
    const roomHandler1 = roomUtil.getRoomHandlerByRoomType(
      gameState.roomState.type,
    );

    // Run Command
    const { commandDescription, roomState: resultingRoomState } =
      roomHandler1.run(gameState.roomState, command);

    // Aggregate Data
    const newRoomState = roomUtil.coerceRoomState(resultingRoomState);
    const roomHandler2 = roomUtil.getRoomHandlerByRoomType(newRoomState.type);
    const { playerStateDescription, availableCommands } =
      roomHandler2.getRoomStateDescription(newRoomState);
    const newGameState: GameState = {
      roomState: newRoomState,
    };
    const gameOutput: GameOutput = {
      commandDescription,
      playerStateDescription,
      availableCommands,
    };

    // Save State
    gameStateUtil.save(newGameState);

    return gameOutput;
  },
};
