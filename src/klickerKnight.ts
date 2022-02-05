import { formatGameOutput } from './utils/formatGameOutput';
import {
  Command,
  CommandDescription,
  DEFAULT_COMMAND,
  GameOutput,
} from './utils/types';

const [input] = process.argv.slice(2);
const command: Command = input ?? DEFAULT_COMMAND;

// TODO: Move fetching command description to RoomHandler
let commandDescription: CommandDescription;
if (command === DEFAULT_COMMAND) {
  commandDescription = null;
} else if (command === 'leave') {
  commandDescription = 'You leave example room 1';
} else {
  commandDescription = 'You cannot do that';
}

// TODO: move aggregating game output to gameUtil
const gameOutput: GameOutput = {
  commandDescription,
  playerStateDescription: 'You are in example room 1',
  availableCommands: ['leave'],
};

const output = formatGameOutput(gameOutput);
process.stdout.write(output);
