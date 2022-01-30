import expect from 'assert';
import { testSingletonModule } from '../../src';
import subtract from '../modules/subtract_DefaultSingletonExport';

testSingletonModule('modules/subtract_DefaultSingletonExport', ({ assert }) => [
  assert('returns the difference of two numbers', () => {
    expect.equal(subtract(5, 3), 2);
  }),

  assert('handles negative numbers', () => {
    expect.equal(subtract(-5, -3), -2);
  }),
]);
