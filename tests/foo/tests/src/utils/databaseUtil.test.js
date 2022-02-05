"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const databaseUtil_1 = require("../../../src/utils/databaseUtil");
const semanticMocha_1 = require("../../testHelpers/semanticMocha");
const tryErrorable_1 = require("../../testHelpers/tryErrorable");
const defaultSaveDirectory = path_1.default.dirname(databaseUtil_1.defaultFilePath);
const getWritePermissionStatus = () => {
    const result = (0, tryErrorable_1.tryErrorable)(() => fs_1.default.accessSync(defaultSaveDirectory, fs_1.default.constants.W_OK));
    return {
        hasWritePermission: !(result instanceof Error),
        permissionError: result instanceof Error ? result.message : '',
    };
};
const FS_READ_ONLY_MODE = 0o444;
describe.only('foo', () => {
    let stream;
    before('one', function () {
        fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '');
        stream = fs_1.default.createReadStream(databaseUtil_1.defaultFilePath, 'utf8');
        // fs.unlinkSync(defaultFilePath);
        // databaseUtil.delete();
        try {
            fs_1.default.unlinkSync(databaseUtil_1.defaultFilePath);
            console.log('ITS FINE');
            return {
                isFileOnDisk: false,
                error: null,
            };
        }
        catch (error) {
            console.log('ERROR');
            return {
                isFileOnDisk: databaseUtil_1.databaseUtil.hasGameFile(),
                error,
            };
        }
    });
    after(function () {
        stream.close();
    });
    it('does stuff', () => { });
});
describe('oof', () => {
    before(function () { });
    it('does something else', () => { });
});
(0, semanticMocha_1.testSingletonModule)('utils/databaseUtil', ({ testIntegration }) => {
    testIntegration.skip('delete', ({ testScenario }) => {
        testScenario('when the file exists, and the util has delete permission')
            .arrange(() => {
            fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '');
            const { hasWritePermission, permissionError } = getWritePermissionStatus();
            (0, chai_1.expect)(hasWritePermission, permissionError).to.eq(true);
        })
            .act(() => {
            const deleteResult = databaseUtil_1.databaseUtil.delete();
            const fileExists = fs_1.default.existsSync(databaseUtil_1.defaultFilePath);
            return {
                deleteResult,
                fileExists,
            };
        })
            .assert('returns a success result', (arranged, { deleteResult }) => {
            const expectedResult = {
                isFileOnDisk: false,
                error: null,
            };
            (0, chai_1.expect)(deleteResult).to.eql(expectedResult);
        })
            .assert('deletes the file', (arranged, { fileExists }) => {
            (0, chai_1.expect)(fileExists).to.eq(false);
        });
        testScenario('when the file does not exist, and the util has delete permission')
            .arrange(() => {
            (0, chai_1.expect)(fs_1.default.existsSync(databaseUtil_1.defaultFilePath)).to.eq(false);
            const { hasWritePermission, permissionError } = getWritePermissionStatus();
            (0, chai_1.expect)(hasWritePermission, permissionError).to.eq(true);
        })
            .act(() => databaseUtil_1.databaseUtil.delete())
            .assert('returns an error result', (arranged, deleteResult) => {
            const expectedNormalizedResult = {
                isFileOnDisk: false,
                error: "ENOENT: no such file or directory, unlink 'saves/data.json'",
            };
            const { error } = deleteResult;
            (0, chai_1.expect)(error).to.be.instanceof(Error);
            (0, chai_1.expect)({
                ...deleteResult,
                error: error.message,
            }).to.eql(expectedNormalizedResult);
        });
        testScenario
            .only('when the file exists, and the util does not have delete permission')
            .arrange(() => {
            fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '');
            const stream = fs_1.default.createReadStream(databaseUtil_1.defaultFilePath, 'utf8');
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
            .act(() => databaseUtil_1.databaseUtil.delete())
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
            .assert('foo', () => { });
        testScenario
            .skip('when the file does not exist, and the util does not have delete permission')
            .arrange(() => {
            (0, chai_1.expect)(fs_1.default.existsSync(databaseUtil_1.defaultFilePath)).to.eq(false);
        })
            .act(() => databaseUtil_1.databaseUtil.delete())
            .assert('returns false', (arranged, deleteResult) => {
            const expectedResult = {
                isFileOnDisk: false,
                error: null,
            };
            (0, chai_1.expect)(deleteResult).to.eql(expectedResult);
        });
    });
    testIntegration.skip('hasGameFile', ({ testScenario }) => {
        testScenario('when the file exists')
            .arrange(() => {
            fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '');
        })
            .annihilate(() => {
            fs_1.default.unlinkSync(databaseUtil_1.defaultFilePath);
        })
            .act(() => databaseUtil_1.databaseUtil.hasGameFile())
            .assert('returns true', (arranged, result) => {
            (0, chai_1.expect)(result).to.eq(true);
        });
        testScenario('when the file does not exist')
            .arrange(() => {
            (0, chai_1.expect)(fs_1.default.existsSync(databaseUtil_1.defaultFilePath)).to.eq(false);
        })
            .act(() => databaseUtil_1.databaseUtil.hasGameFile())
            .assert('returns false', (arranged, result) => {
            (0, chai_1.expect)(result).to.eq(false);
        });
    });
    testIntegration.skip('load', ({ testScenario }) => {
        testScenario('when the file exists and has data')
            .arrange(() => {
            fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '{"foo":"bar"}');
        })
            .annihilate(() => {
            fs_1.default.unlinkSync(databaseUtil_1.defaultFilePath);
        })
            .act(() => databaseUtil_1.databaseUtil.load())
            .assert('returns the parsed data', (arranged, result) => {
            const expectedResult = {
                data: { foo: 'bar' },
                error: null,
            };
            (0, chai_1.expect)(expectedResult).to.eql(expectedResult);
        });
        testScenario('when the file exists and does not have data')
            .arrange(() => {
            fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '');
        })
            .annihilate(() => {
            fs_1.default.unlinkSync(databaseUtil_1.defaultFilePath);
        })
            .act(() => databaseUtil_1.databaseUtil.load())
            .assert('returns null', (arranged, result) => {
            (0, chai_1.expect)(result).to.equal(null);
        });
        testScenario('when the file does not exist')
            .arrange(() => {
            (0, chai_1.expect)(fs_1.default.existsSync(databaseUtil_1.defaultFilePath)).to.eq(false);
        })
            .act(() => databaseUtil_1.databaseUtil.load())
            .assert('returns undefined', (arranged, result) => {
            (0, chai_1.expect)(result).to.eq(undefined);
        });
    });
    testIntegration.skip('save', ({ testScenario }) => {
        testScenario('when the file exists and the new data is valid')
            .arrange(() => {
            fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '');
        })
            .annihilate(() => {
            fs_1.default.unlinkSync(databaseUtil_1.defaultFilePath);
        })
            .act(() => {
            const saveResult = databaseUtil_1.databaseUtil.save({ foo: 'foo' });
            const fileValue = fs_1.default.readFileSync(databaseUtil_1.defaultFilePath, 'utf-8');
            return {
                saveResult,
                fileValue,
            };
        })
            .assert('returns true', (arranged, { saveResult }) => {
            (0, chai_1.expect)(saveResult).to.eq(true);
        })
            .assert('writes to the file', (arranged, { fileValue }) => {
            (0, chai_1.expect)(fileValue).to.eq('{"foo":"foo"}');
        });
        testScenario('when the file does not exist and the new data is valid')
            .arrange(() => {
            (0, chai_1.expect)(fs_1.default.existsSync(databaseUtil_1.defaultFilePath)).to.eq(false);
        })
            .act(() => {
            const saveResult = databaseUtil_1.databaseUtil.save({ foo: 'foo' });
            const fileValue = fs_1.default.readFileSync(databaseUtil_1.defaultFilePath, 'utf-8');
            return {
                saveResult,
                fileValue,
            };
        })
            .assert('returns true', (arranged, { saveResult }) => {
            (0, chai_1.expect)(saveResult).to.eq(true);
        })
            .assert('writes to the file', (arranged, { fileValue }) => {
            (0, chai_1.expect)(fileValue).to.eq('{"foo":"foo"}');
        });
        testScenario('when the new data is invalid')
            .arrange(() => {
            fs_1.default.writeFileSync(databaseUtil_1.defaultFilePath, '{"foo":"bar"}');
        })
            .act(() => {
            const foo = {};
            foo.foo = foo;
            const saveResult = databaseUtil_1.databaseUtil.save(foo);
            const fileValue = fs_1.default.readFileSync(databaseUtil_1.defaultFilePath, 'utf-8');
            return {
                saveResult,
                fileValue,
            };
        })
            .assert('returns false', (arranged, { saveResult }) => {
            (0, chai_1.expect)(saveResult).to.eq(false);
        })
            .assert('does not write to the file', (arranged, { fileValue }) => {
            (0, chai_1.expect)(fileValue).to.eq('{"foo":"bar"}');
        });
    });
});
