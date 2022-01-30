import expect from 'assert';
import { testSingletonModule } from '../../src';
import { add } from '../modules/add_NamedSingletonExport';

testSingletonModule('modules/add_NamedSingletonExport', ({ assert }) => {
  assert('returns the sum of two numbers', () => {
    expect.equal(add(1, 2), 3);
  });

  assert('handles negative numbers', () => {
    expect.equal(add(-1, -2), -3);
  });
});
