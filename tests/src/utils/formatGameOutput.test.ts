import { expect } from 'chai';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { formatGameOutput } from '../../../src/utils/formatGameOutput';
import { GameOutput } from '../../../src/utils/types';

testSingletonModule('utils/formatGameOutput', ({ assert }) => {
  assert('formats a client output object', () => {
    const gameOutput: GameOutput = {
      commandDescription: 'You do something',
      playerStateDescription: 'You are here',
      availableCommands: ['doStuff', 'doThings'],
    };

    const result = formatGameOutput(gameOutput);

    expect(result).to.eq(`
You do something
You are here
Available Commands: doStuff, doThings`);
  });

  assert('omits the command description when it is missing', () => {
    const gameOutput: GameOutput = {
      commandDescription: null,
      playerStateDescription: 'You are here',
      availableCommands: ['doStuff', 'doThings'],
    };

    const result = formatGameOutput(gameOutput);

    expect(result).to.eq(`
You are here
Available Commands: doStuff, doThings`);
  });
});
