import { expect } from 'chai';
import { execSync } from 'child_process';
import { databaseUtil } from '../../src/utils/databaseUtil';
import { DeveloperError } from '../../src/utils/developerError';
import { isNil } from '../../src/utils/types';
import { INVALID_COMMAND } from '../testHelpers/invalidCommand';
import { testIntegration } from '../testHelpers/semanticMocha';

const run = (command: string): string =>
  execSync(`npm run --silent klicker-knight ${command}`).toString();

const cleanupSave = () => databaseUtil.delete();

const availableCommandsRegex =
  /Available Commands: ([0-9A-Za-z]+)(, [0-9A-za-z]*)*/;

// TODO: Figure out how to scale E2E tests https://github.com/normal-devs/klicker-knight/issues/39
testIntegration.skip('klicker-knight', ({ testScenario }) => {
  testScenario('without a command')
    .annihilate(cleanupSave)
    .act(() => run(''))
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.match(/You are in example room \d/);
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.match(availableCommandsRegex);
    });

  testScenario('with a valid command')
    .arrange(() => {
      const firstOutput = run('');
      const [, firstOuputCommand] = firstOutput.match(
        availableCommandsRegex,
      ) ?? [null, null];

      if (isNil(firstOuputCommand)) {
        throw new DeveloperError(
          `Failed to find a valid command from output: "${firstOutput}"`,
        );
      }

      return { firstOuputCommand };
    })
    .annihilate(cleanupSave)
    .act(({ firstOuputCommand }) => run(firstOuputCommand))
    .assert('outputs a command description', (arranged, result) => {
      expect(result).to.match(/\nYou.*\n\nYou/g);
    })
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.match(/You are in/);
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.match(availableCommandsRegex);
    });

  testScenario('with an invalid command')
    .annihilate(cleanupSave)
    .act(() => run(INVALID_COMMAND))
    .assert('outputs a failed command description', (arranged, result) => {
      expect(result).to.include('You cannot do that');
    })
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.match(/You are in example room \d/);
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.match(availableCommandsRegex);
    });

  testScenario('with a literal "default" command')
    .annihilate(cleanupSave)
    .act(() => run('default'))
    .assert('outputs a failed command description', (arranged, result) => {
      expect(result).to.include('You cannot do that');
    })
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.match(/You are in example room \d/);
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.match(availableCommandsRegex);
    });
});
