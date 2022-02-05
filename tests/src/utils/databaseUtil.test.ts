import { expect } from 'chai';
import fs from 'fs';
import { defaultFilePath, databaseUtil } from '../../../src/utils/databaseUtil';
import { testSingletonModule } from '../../testHelpers/semanticMocha';

testSingletonModule('utils/databaseUtil', ({ testIntegration }) => {
  testIntegration('delete', ({ testScenario }) => {
    testScenario('when the file exists')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '');
      })
      .act(() => {
        const deleteResult = databaseUtil.delete();
        const fileExists = fs.existsSync(defaultFilePath);

        return {
          deleteResult,
          fileExists,
        };
      })
      .assert('returns true', (arranged, { deleteResult }) => {
        expect(deleteResult).to.eq(true);
      })
      .assert('deleted the file', (arranged, { fileExists }) => {
        expect(fileExists).to.eq(false);
      });

    testScenario('when the file does not exist')
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.delete())
      .assert('returns false', (arranged, result) => {
        expect(result).to.eq(false);
      });
  });

  testIntegration('hasGameFile', ({ testScenario }) => {
    testScenario('when the file exists')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '');
      })
      .annihilate(() => {
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.hasGameFile())
      .assert('returns true', (arranged, result) => {
        expect(result).to.eq(true);
      });

    testScenario('when the file does not exist')
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.hasGameFile())
      .assert('returns false', (arranged, result) => {
        expect(result).to.eq(false);
      });
  });

  testIntegration('load', ({ testScenario }) => {
    testScenario('when the file exists and has data')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '{"foo":"bar"}');
      })
      .annihilate(() => {
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.load())
      .assert('returns the parsed data', (arranged, result) => {
        expect(result).to.eql({ foo: 'bar' });
      });

    testScenario('when the file exists and does not have data')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '');
      })
      .annihilate(() => {
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.load())
      .assert('returns null', (arranged, result) => {
        expect(result).to.equal(null);
      });

    testScenario('when the file does not exist')
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.load())
      .assert('returns null', (arranged, result) => {
        expect(result).to.eq(null);
      });
  });

  testIntegration('save', ({ testScenario }) => {
    testScenario('when the file exists and the new data is valid')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '');
      })
      .annihilate(() => {
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => {
        const saveResult = databaseUtil.save({ foo: 'foo' });
        const fileValue = fs.readFileSync(defaultFilePath, 'utf-8');

        return {
          saveResult,
          fileValue,
        };
      })
      .assert('returns true', (arranged, { saveResult }) => {
        expect(saveResult).to.eq(true);
      })
      .assert('writes to the file', (arranged, { fileValue }) => {
        expect(fileValue).to.eq('{"foo":"foo"}');
      });

    testScenario('when the file does not exist and the new data is valid')
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => {
        const saveResult = databaseUtil.save({ foo: 'foo' });
        const fileValue = fs.readFileSync(defaultFilePath, 'utf-8');

        return {
          saveResult,
          fileValue,
        };
      })
      .assert('returns true', (arranged, { saveResult }) => {
        expect(saveResult).to.eq(true);
      })
      .assert('writes to the file', (arranged, { fileValue }) => {
        expect(fileValue).to.eq('{"foo":"foo"}');
      });

    testScenario('when the new data is invalid')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '{"foo":"bar"}');
      })
      .act(() => {
        const foo: Record<string, object> = {};
        foo.foo = foo;

        const saveResult = databaseUtil.save(foo);
        const fileValue = fs.readFileSync(defaultFilePath, 'utf-8');

        return {
          saveResult,
          fileValue,
        };
      })
      .assert('returns false', (arranged, { saveResult }) => {
        expect(saveResult).to.eq(false);
      })
      .assert('does not write to the file', (arranged, { fileValue }) => {
        expect(fileValue).to.eq('{"foo":"bar"}');
      });
  });
});
