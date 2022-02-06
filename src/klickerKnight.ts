import { ExampleRoom1Handler } from './roomHandlers/exampleRoom1Handler';
import { formatGameOutput } from './utils/formatGameOutput';
import { gameStateUtil } from './utils/gameStateUtil';
import { Command, DEFAULT_COMMAND, GameOutput, GameState } from './utils/types';

const [input] = process.argv.slice(2);
const command: Command = input ?? DEFAULT_COMMAND;

// TODO: move orchestration to gameUtil
const gameState = gameStateUtil.load();
const roomHandler = new ExampleRoom1Handler();
const { commandDescription, roomState: resultingRoomState } = roomHandler.run(
  gameState.roomState,
  command,
);
const { playerStateDescription, availableCommands } =
  roomHandler.getRoomStateDescription(resultingRoomState);

// TODO: handle a room transition (resultingRoomState is null)
const newGameState: GameState = {
  roomState: resultingRoomState,
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
