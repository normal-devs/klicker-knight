import expect from 'assert';
import { testSingletonModule } from '../../src';
import { shuffle } from '../modules/shuffle';

testSingletonModule(
  'modules/shuffle (multiple related assertions)',
  ({ testScenario }) => {
    testScenario('by default')
      .act(() => {
        return shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      })
      .assert('returns a list of the same length', (arranged, result) => {
        expect.equal(result.length, 10);
      })
      .assert('can return items in a different order', (arranged, result) => {
        expect.ok(result.some((value, index) => value !== index + 1));
      });
  },
);
