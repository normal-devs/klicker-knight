import { expect } from 'chai';
import fs from 'fs';
import sinon, { SinonSpy } from 'sinon';
import {
  defaultFilePath,
  databaseUtil,
  DeleteResult,
  LoadResult,
  SaveResult,
} from '../../../src/utils/databaseUtil';
import { testSingletonModule } from '../../testHelpers/semanticMocha';

testSingletonModule('utils/databaseUtil', ({ testIntegration }) => {
  testIntegration('delete', ({ testScenario }) => {
    testScenario('when the file exists and it is deleted without error')
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
      .assert('returns a success result', (arranged, { deleteResult }) => {
        const expectedResult: DeleteResult = {
          isFileOnDisk: false,
          error: null,
        };

        expect(deleteResult).to.eql(expectedResult);
      })
      .assert('deletes the file', (arranged, { fileExists }) => {
        expect(fileExists).to.eq(false);
      });

    testScenario('when the file does not exist')
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.delete())
      .assert('returns an error result', (arranged, deleteResult) => {
        const expectedNormalizedResult: DeleteResult = {
          isFileOnDisk: false,
          error: "ENOENT: no such file or directory, unlink 'saves/data.json'",
        };

        const { error } = deleteResult;
        expect(error).to.be.instanceof(Error);
        expect({
          ...deleteResult,
          error: (error as Error).message,
        }).to.eql(expectedNormalizedResult);
      });

    // Note: Ideally we don't want to stub fs, but I don't know how to simulate this scenario on Windows
    testScenario('when the file exists and the delete fails')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '');

        const mockError = new Error('Mock Error');
        sinon.stub(fs, 'unlinkSync').throws(mockError);

        return mockError;
      })
      .annihilate(() => {
        sinon.restore();
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => {
        const deleteResult = databaseUtil.delete();
        const fileExists = fs.existsSync(defaultFilePath);

        return {
          deleteResult,
          fileExists,
        };
      })
      .assert('attempts to delete the file', () => {
        expect((fs.unlinkSync as SinonSpy).args).to.eql([[defaultFilePath]]);
      })
      .assert('returns an error result', (mockError, { deleteResult }) => {
        const expectedResult: DeleteResult = {
          isFileOnDisk: true,
          error: mockError,
        };

        expect(deleteResult).to.eql(expectedResult);
      })

      .assert('does not delete the file', (arranged, { fileExists }) => {
        expect(fileExists).to.eq(true);
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
    testScenario('when the file exists and has valid JSON data')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '{"foo":"bar"}');
      })
      .annihilate(() => {
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.load())
      .assert(
        'returns a success result with the parsed data',
        (arranged, result) => {
          const expectedResult: LoadResult = {
            data: { foo: 'bar' },
            error: null,
          };

          expect(result).to.eql(expectedResult);
        },
      );

    testScenario('when the file exists and does not have valid JSON data')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, 'foo');
      })
      .annihilate(() => {
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.load())
      .assert('returns an error result', (arranged, result) => {
        const expectedNormalizedResult: LoadResult = {
          data: null,
          error: 'Unexpected token o in JSON at position 1',
        };

        const { error } = result;
        expect(error).to.be.instanceof(Error);
        expect({
          ...result,
          error: (error as Error).message,
        }).to.eql(expectedNormalizedResult);
      });

    testScenario('when the file does not exist')
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.load())
      .assert('returns an error result', (arranged, result) => {
        const expectedNormalizedResult: LoadResult = {
          data: null,
          error: "ENOENT: no such file or directory, open 'saves/data.json'",
        };

        const { error } = result;
        expect(error).to.be.instanceof(Error);
        expect({
          ...result,
          error: (error as Error).message,
        }).to.eql(expectedNormalizedResult);
      });
  });

  testIntegration('save', ({ testScenario }) => {
    testScenario('when the file exists and the new data is valid JSON')
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
      .assert('returns a success result', (arranged, { saveResult }) => {
        const expectedResult: SaveResult = {
          isSaved: true,
          error: null,
        };

        expect(saveResult).to.eql(expectedResult);
      })
      .assert('writes to the file', (arranged, { fileValue }) => {
        expect(fileValue).to.eq('{"foo":"foo"}');
      });

    testScenario('when the file does not exist and the new data is valid JSON')
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
      .assert('returns a success result', (arranged, { saveResult }) => {
        const expectedResult: SaveResult = {
          isSaved: true,
          error: null,
        };

        expect(saveResult).to.eql(expectedResult);
      })
      .assert('writes to the file', (arranged, { fileValue }) => {
        expect(fileValue).to.eq('{"foo":"foo"}');
      });

    testScenario('when the new data cannot be serialized')
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
      .assert('returns an error result', (arranged, { saveResult }) => {
        const expectedNormalizedResult: SaveResult = {
          isSaved: false,
          error:
            "Converting circular structure to JSON\n    --> starting at object with constructor 'Object'\n    --- property 'foo' closes the circle",
        };

        const { error } = saveResult;
        expect(error).to.be.instanceof(Error);
        expect({
          ...saveResult,
          error: (error as Error).message,
        }).to.eql(expectedNormalizedResult);
      })
      .assert('does not write to the file', (arranged, { fileValue }) => {
        expect(fileValue).to.eq('{"foo":"bar"}');
      });
  });
});
