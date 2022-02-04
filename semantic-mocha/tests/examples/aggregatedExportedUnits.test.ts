import expect from 'assert';
import { testSingletonModule } from '../../src';
import { math } from '../modules/math_AggregatedExport';

testSingletonModule('modules/math_AggregatedExport', ({ testUnit }) => {
  testUnit('add', ({ assert }) => {
    assert('returns the sum of two numbers', () => {
      expect.equal(math.add(1, 2), 3);
    });

    assert('handles negative numbers', () => {
      expect.equal(math.add(-1, -2), -3);
    });
  });

  testUnit('subtract', ({ assert }) => {
    assert('returns the difference of two numbers', () => {
      expect.equal(math.subtract(5, 3), 2);
    });

    assert('handles negative numbers', () => {
      expect.equal(math.subtract(-5, -3), -2);
    });
  });
});
