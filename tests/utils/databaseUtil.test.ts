import { expect } from 'chai';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { defaultFilePath, databaseUtil } from '../../src/utils/databaseUtil';
import { testSingletonModule } from '../testHelpers/semanticMocha';

testSingletonModule('utils/databaseUtil', ({ testUnit }) => {
  testUnit('hasGameFile', ({ testScenario }) => {
    testScenario('when the file exists')
      .arrange(() => {
        writeFileSync(defaultFilePath, '');
      })
      .annihilate(() => {
        unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.hasGameFile())
      .assert('returns true', (arranged, result) => {
        expect(result).to.eq(true);
      });

    testScenario('when the file does not exist')
      .arrange(() => {
        expect(existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.hasGameFile())
      .assert('returns false', (arranged, result) => {
        expect(result).to.eq(false);
      });
  });

  testUnit('load', ({ testScenario }) => {
    testScenario('when the file exists and has data')
      .arrange(() => {
        writeFileSync(defaultFilePath, '{"foo":"bar"}');
      })
      .annihilate(() => {
        unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.load())
      .assert('returns the parsed data', (arranged, result) => {
        expect(result).to.eql({ foo: 'bar' });
      });

    testScenario('when the file exists and does not have data')
      .arrange(() => {
        writeFileSync(defaultFilePath, '');
      })
      .annihilate(() => {
        unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.load())
      .assert('returns null', (arranged, result) => {
        expect(result).to.equal(null);
      });

    testScenario('when the file does not exist')
      .arrange(() => {
        expect(existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.load())
      .assert('returns null', (arranged, result) => {
        expect(result).to.eq(null);
      });
  });

  testUnit('save', ({ testScenario }) => {
    testScenario('when the file exists and the new data is valid')
      .arrange(() => {
        writeFileSync(defaultFilePath, '');
      })
      .annihilate(() => {
        unlinkSync(defaultFilePath);
      })
      .act(() => {
        const saveResult = databaseUtil.save({ foo: 'foo' });
        const fileValue = readFileSync(defaultFilePath, 'utf-8');

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
        expect(existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => {
        const saveResult = databaseUtil.save({ foo: 'foo' });
        const fileValue = readFileSync(defaultFilePath, 'utf-8');

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
        writeFileSync(defaultFilePath, '{"foo":"bar"}');
      })
      .act(() => {
        const foo: Record<string, object> = {};
        foo.foo = foo;

        const saveResult = databaseUtil.save(foo);
        const fileValue = readFileSync(defaultFilePath, 'utf-8');

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

  testUnit('delete', ({ testScenario }) => {
    testScenario('when the file exists')
      .arrange(() => {
        writeFileSync(defaultFilePath, '');
      })
      .act(() => {
        const deleteResult = databaseUtil.delete();
        const fileExists = existsSync(defaultFilePath);

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
        expect(existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.delete())
      .assert('returns false', (arranged, result) => {
        expect(result).to.eq(false);
      });
  });
});
