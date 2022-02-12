import { formatGameOutput } from './utils/formatGameOutput';
import { gameUtil } from './utils/gameUtil';
import { Command, DEFAULT_COMMAND } from './utils/types';

const [input] = process.argv.slice(2);
const command: Command = input ?? DEFAULT_COMMAND;

const gameOutput = gameUtil.run(command);
const serializedOutput = formatGameOutput(gameOutput);

process.stdout.write(serializedOutput);
