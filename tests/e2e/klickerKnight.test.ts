import { expect } from 'chai';
import { execSync } from 'child_process';
import { databaseUtil } from '../../src/utils/databaseUtil';
import { testIntegration } from '../testHelpers/semanticMocha';

testIntegration('klicker-knight', ({ testScenario }) => {
  testScenario('always')
    .annihilate(() => {
      databaseUtil.delete();
    })
    .act(() => execSync('npm run --silent klicker-knight').toString())
    .assert('trips on a flagstone', (arrranged, result) => {
      expect(result).to.contain('flagstone. You fall and break your neck.');
    });
});
