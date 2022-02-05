import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import {
  defaultFilePath,
  databaseUtil,
  DeleteResult,
  LoadResult,
} from '../../../src/utils/databaseUtil';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { tryErrorable } from '../../testHelpers/tryErrorable';

const defaultSaveDirectory = path.dirname(defaultFilePath);

const getWritePermissionStatus = () => {
  const result = tryErrorable(() =>
    fs.accessSync(defaultSaveDirectory, fs.constants.W_OK),
  );

  return {
    hasWritePermission: !(result instanceof Error),
    permissionError: result instanceof Error ? result.message : '',
  };
};

const FS_READ_ONLY_MODE = 0o444;

describe.only('foo', () => {
  let stream: fs.ReadStream;
  before('one', function () {
    fs.writeFileSync(defaultFilePath, '');
    stream = fs.createReadStream(defaultFilePath, 'utf8');

    // fs.unlinkSync(defaultFilePath);
    // databaseUtil.delete();

    try {
      fs.unlinkSync(defaultFilePath);
      console.log('ITS FINE');

      return {
        isFileOnDisk: false,
        error: null,
      };
    } catch (error) {
      console.log('ERROR');
      return {
        isFileOnDisk: databaseUtil.hasGameFile(),
        error,
      };
    }
  });
  // after('two', function () {
  //   // stream.close();
  // });

  it('does stuff', () => {});
});

describe('oof', () => {
  before(function () {});

  it('does something else', () => {});
});

testSingletonModule('utils/databaseUtil', ({ testIntegration }) => {
  testIntegration.skip('delete', ({ testScenario }) => {
    testScenario('when the file exists, and the util has delete permission')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '');

        const { hasWritePermission, permissionError } =
          getWritePermissionStatus();
        expect(hasWritePermission, permissionError).to.eq(true);
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

    testScenario(
      'when the file does not exist, and the util has delete permission',
    )
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);

        const { hasWritePermission, permissionError } =
          getWritePermissionStatus();
        expect(hasWritePermission, permissionError).to.eq(true);
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

    testScenario
      .only(
        'when the file exists, and the util does not have delete permission',
      )
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '');

        const stream = fs.createReadStream(defaultFilePath, 'utf8');

        // const initialMode = fs.statSync(defaultSaveDirectory).mode;
        // fs.chmodSync(defaultSaveDirectory, FS_READ_ONLY_MODE);
        // fs.chmodSync(defaultFilePath, FS_READ_ONLY_MODE);
        // console.log(fs.statSync(defaultFilePath).mode.toString(8));
        // console.log(fs.statSync(defaultSaveDirectory).mode.toString(8));

        // return initialMode;
        // return stream;
      })
      // .annihilate((stream) => {
      //   // stream.close();
      //   // fs.chmodSync(defaultSaveDirectory, initialMode);
      //   // fs.unlinkSync(defaultFilePath);
      // })
      .act(() => databaseUtil.delete())
      // .assert('returns an error result', (arranged, deleteResult) => {
      //   const expectedNormalizedResult: DeleteResult = {
      //     isFileOnDisk: true,
      //     error: 'idk',
      //   };

      //   const { error } = deleteResult;
      //   expect(error).to.be.instanceof(Error);
      //   expect({
      //     ...deleteResult,
      //     error: (error as Error).message,
      //   }).to.eql(expectedNormalizedResult);
      // });
      .assert('foo', () => {});

    testScenario
      .skip(
        'when the file does not exist, and the util does not have delete permission',
      )
      .arrange(() => {
        expect(fs.existsSync(defaultFilePath)).to.eq(false);
      })
      .act(() => databaseUtil.delete())
      .assert('returns false', (arranged, deleteResult) => {
        const expectedResult: DeleteResult = {
          isFileOnDisk: false,
          error: null,
        };

        expect(deleteResult).to.eql(expectedResult);
      });
  });

  testIntegration.skip('hasGameFile', ({ testScenario }) => {
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

  testIntegration.skip('load', ({ testScenario }) => {
    testScenario('when the file exists and has data')
      .arrange(() => {
        fs.writeFileSync(defaultFilePath, '{"foo":"bar"}');
      })
      .annihilate(() => {
        fs.unlinkSync(defaultFilePath);
      })
      .act(() => databaseUtil.load())
      .assert('returns the parsed data', (arranged, result) => {
        const expectedResult: LoadResult = {
          data: { foo: 'bar' },
          error: null,
        };

        expect(expectedResult).to.eql(expectedResult);
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
      .assert('returns undefined', (arranged, result) => {
        expect(result).to.eq(undefined);
      });
  });

  testIntegration.skip('save', ({ testScenario }) => {
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
