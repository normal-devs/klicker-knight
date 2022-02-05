"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStateUtil = void 0;
const tslib_1 = require("tslib");
const ajv_1 = (0, tslib_1.__importDefault)(require("ajv"));
const databaseUtil_1 = require("./databaseUtil");
const gameState_schema_json_1 = (0, tslib_1.__importDefault)(require("./types/gameState.schema.json"));
const developerError_1 = require("./developerError");
const ajv = new ajv_1.default();
const validateGameState = ajv.compile(gameState_schema_json_1.default);
const isGameState = (unknownState) => validateGameState(unknownState);
const init = () => ({
    currentRoomId: null,
});
exports.gameStateUtil = {
    load: () => {
        const unknownState = databaseUtil_1.databaseUtil.load();
        const hasValidSaveState = isGameState(unknownState);
        const gameState = hasValidSaveState ? unknownState : init();
        if (!hasValidSaveState) {
            exports.gameStateUtil.save(gameState);
        }
        return gameState;
    },
    save: (state) => {
        if (!isGameState(state)) {
            throw new developerError_1.DeveloperError('Attempted to save an invalid game state. Did you forget to compile the game state schema?');
        }
        const isSaved = databaseUtil_1.databaseUtil.save(state);
        if (!isSaved) {
            throw new developerError_1.DeveloperError('Database failed to save the game state.');
        }
    },
};
