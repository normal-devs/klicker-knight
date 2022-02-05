"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGameState = void 0;
const tslib_1 = require("tslib");
const schema_to_generator_1 = require("@randograms/schema-to-generator");
const gameState_schema_json_1 = (0, tslib_1.__importDefault)(require("../../src/utils/types/gameState.schema.json"));
exports.generateGameState = (0, schema_to_generator_1.schemaToGenerator)(gameState_schema_json_1.default);
