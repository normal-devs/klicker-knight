import { test } from '@oclif/test';
import { expect } from 'chai';

import { KlickerKnight } from '../src/klickerKnight';

describe('klicker-knight', () => {
  test
    .stdout()
    .do(() => KlickerKnight.run([]))
    .it('trips on a flagstone', (ctx) => {
      expect(ctx.stdout).to.contain('flagstone. You fall and break your neck.');
    });
});
