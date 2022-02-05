import { GameOutput } from './types';

export const formatGameOutput = (gameOutput: GameOutput): string => {
  const outputList: string[] = [];

  if (gameOutput.commandDescription !== null) {
    outputList.push(gameOutput.commandDescription);
  }

  outputList.push(gameOutput.playerStateDescription);

  outputList.push(
    `Available Commands: ${gameOutput.availableCommands.join(', ')}`,
  );

  return `\n${outputList.join('\n')}`;
};
