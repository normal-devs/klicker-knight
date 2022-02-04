import expect from 'assert';
import { testSingletonModule } from '../../src';
import { randomRange } from '../modules/randomRange';

testSingletonModule(
  'modules/randomRange (state dependent)',
  ({ testScenario }) => {
    testScenario('when Math.random returns 0')
      .arrange(() => {
        const originalRandom = Math.random;

        const spy = { called: false };

        Math.random = () => {
          spy.called = true;
          return 0;
        };

        // Not a recommended pattern.
        // Demonstrates using arranged values in the act step.
        const args: [number, number] = [1, 5];

        return {
          originalRandom,
          spy,
          args,
        };
      })
      .annihilate(({ originalRandom }) => {
        Math.random = originalRandom;
      })
      .act(({ args }) => {
        return randomRange(...args);
      })
      .assert('calls Math.random', ({ spy }) => {
        expect.ok(spy.called);
      })
      .assert('returns the lower bound', (unused, result) => {
        expect.equal(result, 1);
      });

    testScenario('when Math.random returns a number close to 1')
      .arrange(() => {
        const originalRandom = Math.random;
        Math.random = () => 0.999;
        return { originalRandom };
      })
      .annihilate(({ originalRandom }) => {
        Math.random = originalRandom;
      })
      .act(() => {
        return randomRange(1, 7);
      })
      .assert('returns the upper bound', (unused, result) => {
        expect.equal(result, 7);
      });
  },
);
