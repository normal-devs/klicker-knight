"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const sinon_1 = (0, tslib_1.__importDefault)(require("sinon"));
const databaseUtil_1 = require("../../../src/utils/databaseUtil");
const gameStateUtil_1 = require("../../../src/utils/gameStateUtil");
const generateGameState_1 = require("../../testHelpers/generateGameState");
const semanticMocha_1 = require("../../testHelpers/semanticMocha");
const tryErrorable_1 = require("../../testHelpers/tryErrorable");
semanticMocha_1.testSingletonModule.skip('utils/gameStateUtil', ({ testUnit }) => {
    testUnit('load', ({ testScenario }) => {
        testScenario('when the game data is valid')
            .arrange(() => {
            const mockGameState = (0, generateGameState_1.generateGameState)();
            sinon_1.default.stub(databaseUtil_1.databaseUtil, 'load').returns({
                data: mockGameState,
                error: null,
            });
            sinon_1.default.stub(gameStateUtil_1.gameStateUtil, 'save');
            return mockGameState;
        })
            .annihilate(() => {
            sinon_1.default.restore();
        })
            .act(() => gameStateUtil_1.gameStateUtil.load())
            .assert('loads the game data', () => {
            (0, chai_1.expect)(databaseUtil_1.databaseUtil.load.calledOnce).to.eq(true);
        })
            .assert('returns the game state', (mockGameState, result) => {
            (0, chai_1.expect)(result).to.eq(mockGameState);
        })
            .assert('does not save the new game state', () => {
            (0, chai_1.expect)(gameStateUtil_1.gameStateUtil.save.called).to.eq(false);
        });
        testScenario('when the game data is invalid')
            .arrange(() => {
            sinon_1.default.stub(databaseUtil_1.databaseUtil, 'load').returns({
                data: 'not a game state',
                error: null,
            });
            sinon_1.default.stub(gameStateUtil_1.gameStateUtil, 'save');
        })
            .annihilate(() => {
            sinon_1.default.restore();
        })
            .act(() => gameStateUtil_1.gameStateUtil.load())
            .assert('loads the game data', () => {
            (0, chai_1.expect)(databaseUtil_1.databaseUtil.load.calledOnce).to.eq(true);
        })
            .assert('saves a new game state', () => {
            (0, chai_1.expect)(gameStateUtil_1.gameStateUtil.save.args).to.eql([
                [
                    {
                        currentRoomId: null,
                    },
                ],
            ]);
        })
            .assert('returns a new game state', (arranged, result) => {
            (0, chai_1.expect)(result).to.eql({
                currentRoomId: null,
            });
        });
    });
    testUnit('save', ({ testScenario }) => {
        testScenario('with a valid game state')
            .arrange(() => {
            sinon_1.default.stub(databaseUtil_1.databaseUtil, 'save').returns({
                isSaved: true,
                error: null,
            });
            const mockGameState = (0, generateGameState_1.generateGameState)();
            return mockGameState;
        })
            .annihilate(() => {
            sinon_1.default.restore();
        })
            .act((mockGameState) => gameStateUtil_1.gameStateUtil.save(mockGameState))
            .assert('saves the game state', () => {
            (0, chai_1.expect)(databaseUtil_1.databaseUtil.save.args).to.eql([
                [
                    {
                        currentRoomId: null,
                    },
                ],
            ]);
        });
        testScenario('with an invalid game state')
            .arrange(() => {
            sinon_1.default.stub(databaseUtil_1.databaseUtil, 'save');
        })
            .annihilate(() => {
            sinon_1.default.restore();
        })
            .act(() => {
            return (0, tryErrorable_1.tryErrorable)(() => {
                gameStateUtil_1.gameStateUtil.save({});
            });
        })
            .assert('throws an error', (arranged, error) => {
            (0, chai_1.expect)(error).to.be.an.instanceOf(Error);
            (0, chai_1.expect)(error.message).to.include('invalid game state');
        })
            .assert('does not save the game state', () => {
            (0, chai_1.expect)(databaseUtil_1.databaseUtil.save.called).to.eq(false);
        });
        testScenario('when the databaseUtil fails to save the data')
            .arrange(() => {
            sinon_1.default.stub(databaseUtil_1.databaseUtil, 'save').returns({
                isSaved: false,
                error: Symbol('doesnt matter'),
            });
            const mockGameState = (0, generateGameState_1.generateGameState)();
            return mockGameState;
        })
            .annihilate(() => {
            sinon_1.default.restore();
        })
            .act((mockGameState) => {
            return (0, tryErrorable_1.tryErrorable)(() => {
                gameStateUtil_1.gameStateUtil.save(mockGameState);
            });
        })
            .assert('attempts to save the data', (mockGameState) => {
            (0, chai_1.expect)(databaseUtil_1.databaseUtil.save.args).to.eql([[mockGameState]]);
        })
            .assert('throws an error', (arranged, error) => {
            (0, chai_1.expect)(error).to.be.an.instanceOf(Error);
            (0, chai_1.expect)(error.message).to.include('Database failed');
        });
    });
});
