import { expect } from 'chai';
import { execSync } from 'child_process';
import { databaseUtil } from '../../src/utils/databaseUtil';
import { testIntegration } from '../testHelpers/semanticMocha';

const run = (command: string): string =>
  execSync(`npm run --silent klicker-knight ${command}`).toString();

const cleanupSave = () => databaseUtil.delete();

testIntegration('klicker-knight', ({ testScenario }) => {
  testScenario('without a command')
    .annihilate(cleanupSave)
    .act(() => run(''))
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.include('You are in example room 1');
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.include('Available Commands: leave');
    });

  testScenario('with a valid command')
    .annihilate(cleanupSave)
    .act(() => run('leave'))
    .assert('outputs a command description', (arranged, result) => {
      expect(result).to.include('You leave example room 1');
    })
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.include('You are in example room 1');
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.include('Available Commands: leave');
    });

  testScenario('with an invalid command')
    .annihilate(cleanupSave)
    .act(() => run('super-invalid-command-ok-thnx'))
    .assert('outputs a failed command description', (arranged, result) => {
      expect(result).to.include('You cannot do that');
    })
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.include('You are in example room 1');
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.include('Available Commands: leave');
    });

  testScenario('with a literal "default" command')
    .annihilate(cleanupSave)
    .act(() => run('default'))
    .assert('outputs a failed command description', (arranged, result) => {
      expect(result).to.include('You cannot do that');
    })
    .assert('outputs a room description', (arranged, result) => {
      expect(result).to.include('You are in example room 1');
    })
    .assert('outputs available commands', (arranged, result) => {
      expect(result).to.include('Available Commands: leave');
    });
});
