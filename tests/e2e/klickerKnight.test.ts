import { expect } from 'chai';
import { execSync } from 'child_process';
import { databaseUtil } from '../../src/utils/databaseUtil';

describe('klicker-knight', () => {
  after(() => {
    databaseUtil.delete();
  });

  it('trips on a flagstone', () => {
    const result = execSync('npm run --silent klicker-knight');
    expect(result.toString()).to.contain(
      'flagstone. You fall and break your neck.',
    );
  });
});
