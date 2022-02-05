"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseUtil = exports.defaultFilePath = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
exports.defaultFilePath = 'saves/data.json';
exports.databaseUtil = {
    // delete(): DeleteResult {
    //   try {
    //     fs.unlinkSync(defaultFilePath);
    //     return {
    //       isFileOnDisk: false,
    //       error: null,
    //     };
    //   } catch (error) {
    //     return {
    //       isFileOnDisk: databaseUtil.hasGameFile(),
    //       error,
    //     };
    //   }
    // },
    delete() {
        try {
            fs_1.default.unlinkSync(exports.defaultFilePath);
            console.log('ITS FINE');
            return {
                isFileOnDisk: false,
                error: null,
            };
        }
        catch (error) {
            console.log('ERROR');
            return {
                isFileOnDisk: exports.databaseUtil.hasGameFile(),
                error,
            };
        }
    },
    hasGameFile() {
        return fs_1.default.existsSync(exports.defaultFilePath);
    },
    load() {
        try {
            const data = fs_1.default.readFileSync(exports.defaultFilePath, 'utf-8');
            return {
                data: JSON.parse(data),
                error: null,
            };
        }
        catch (error) {
            return {
                data: null,
                error,
            };
        }
    },
    save(data) {
        try {
            fs_1.default.writeFileSync(exports.defaultFilePath, JSON.stringify(data));
            return {
                isSaved: true,
                error: null,
            };
        }
        catch (error) {
            return {
                isSaved: false,
                error: null,
            };
        }
    },
};
