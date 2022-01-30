import expect from 'assert';
import { testModule } from '../../src';
import { add, subtract } from '../modules/math_IndividualExports';

testModule('modules/math_IndividualExports', ({ testExport }) => {
  testExport('add', ({ assert }) => {
    assert('returns the sum of two numbers', () => {
      expect.equal(add(1, 2), 3);
    });

    assert('handles negative numbers', () => {
      expect.equal(add(-1, -2), -3);
    });
  });

  testExport('subtract', ({ assert }) => {
    assert('returns the difference of two numbers', () => {
      expect.equal(subtract(5, 3), 2);
    });

    assert('handles negative numbers', () => {
      expect.equal(subtract(-5, -3), -2);
    });
  });
});
