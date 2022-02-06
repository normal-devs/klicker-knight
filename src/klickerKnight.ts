import { formatGameOutput } from './utils/formatGameOutput';
import { gameStateUtil } from './utils/gameStateUtil';
import { roomUtil } from './utils/roomUtil';
import { Command, DEFAULT_COMMAND, GameOutput, GameState } from './utils/types';

const [input] = process.argv.slice(2);
const command: Command = input ?? DEFAULT_COMMAND;

// TODO: move orchestration to gameUtil
const gameState = gameStateUtil.load();
const roomHandler1 = roomUtil.getRoomHandlerByRoomType(
  gameState.roomState.type,
);
const { commandDescription, roomState: resultingRoomState } = roomHandler1.run(
  gameState.roomState,
  command,
);

const newRoomState = roomUtil.coerceRoomState(resultingRoomState);
const roomHandler2 = roomUtil.getRoomHandlerByRoomType(newRoomState.type);
const { playerStateDescription, availableCommands } =
  roomHandler2.getRoomStateDescription(newRoomState);

const newGameState: GameState = {
  roomState: newRoomState,
};
gameStateUtil.save(newGameState);

// TODO: move aggregating game output to gameUtil
const gameOutput: GameOutput = {
  commandDescription,
  playerStateDescription,
  availableCommands,
};

const output = formatGameOutput(gameOutput);
process.stdout.write(output);
