import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { databaseUtil } from '../../../src/utils/databaseUtil';
import { gameStateUtil } from '../../../src/utils/gameStateUtil';
import { GameState } from '../../../src/utils/types';
import { generateGameState } from '../../testHelpers/generateGameState';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { tryErrorable } from '../../testHelpers/tryErrorable';

testSingletonModule('utils/gameStateUtil', ({ testUnit }) => {
  testUnit('load', ({ testScenario }) => {
    testScenario('when the game data is valid')
      .arrange(() => {
        const mockGameState = generateGameState();
        sinon.stub(databaseUtil, 'load').returns({
          data: mockGameState,
          error: null,
        });
        sinon.stub(gameStateUtil, 'save');

        return mockGameState;
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act(() => gameStateUtil.load())
      .assert('loads the game data', () => {
        expect((databaseUtil.load as SinonSpy).calledOnce).to.eq(true);
      })
      .assert('returns the game state', (mockGameState, result) => {
        expect(result).to.eq(mockGameState);
      })
      .assert('does not save the new game state', () => {
        expect((gameStateUtil.save as SinonSpy).called).to.eq(false);
      });

    testScenario('when the game data does not exist')
      .arrange(() => {
        sinon.stub(databaseUtil, 'load').returns({
          data: null,
          error: Symbol('whoops'),
        });
        sinon.stub(gameStateUtil, 'save');

        const expectedGameState: GameState = {
          roomState: {
            type: 'exampleRoom1',
            playerState: 'AtEntrance',
          },
        };
        return expectedGameState;
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act(() => gameStateUtil.load())
      .assert('loads the game data', () => {
        expect((databaseUtil.load as SinonSpy).calledOnce).to.eq(true);
      })
      .assert('saves a new game state', (expectedGameState) => {
        expect((gameStateUtil.save as SinonSpy).args).to.eql([
          [expectedGameState],
        ]);
      })
      .assert('returns a new game state', (expectedGameState, result) => {
        expect(result).to.eql(expectedGameState);
      });

    testScenario('when the game data is invalid')
      .arrange(() => {
        sinon.stub(databaseUtil, 'load').returns({
          data: 'not a game state',
          error: null,
        });
        sinon.stub(gameStateUtil, 'save');

        const expectedGameState: GameState = {
          roomState: {
            type: 'exampleRoom1',
            playerState: 'AtEntrance',
          },
        };
        return expectedGameState;
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act(() => gameStateUtil.load())
      .assert('loads the game data', () => {
        expect((databaseUtil.load as SinonSpy).calledOnce).to.eq(true);
      })
      .assert('saves a new game state', (expectedGameState) => {
        expect((gameStateUtil.save as SinonSpy).args).to.eql([
          [expectedGameState],
        ]);
      })
      .assert('returns a new game state', (expectedGameState, result) => {
        expect(result).to.eql(expectedGameState);
      });
  });

  testUnit('save', ({ testScenario }) => {
    testScenario('with a valid game state')
      .arrange(() => {
        sinon.stub(databaseUtil, 'save').returns({
          isSaved: true,
          error: null,
        });
        const mockGameState = generateGameState();
        return mockGameState;
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act((mockGameState) => gameStateUtil.save(mockGameState))
      .assert('saves the game state', () => {
        const expectedGameState: GameState = {
          roomState: {
            type: 'exampleRoom1',
            playerState: 'AtEntrance',
          },
        };

        expect((databaseUtil.save as SinonSpy).args).to.eql([
          [expectedGameState],
        ]);
      });

    testScenario('with an invalid game state')
      .arrange(() => {
        sinon.stub(databaseUtil, 'save');
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act(() => {
        return tryErrorable(() => {
          gameStateUtil.save({});
        });
      })
      .assert('throws an error', (arranged, error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect((error as Error).message).to.include('invalid game state');
      })
      .assert('does not save the game state', () => {
        expect((databaseUtil.save as SinonSpy).called).to.eq(false);
      });

    testScenario('when the databaseUtil fails to save the data')
      .arrange(() => {
        sinon.stub(databaseUtil, 'save').returns({
          isSaved: false,
          error: Symbol('whoops'),
        });
        const mockGameState = generateGameState();
        return mockGameState;
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act((mockGameState) => {
        return tryErrorable(() => {
          gameStateUtil.save(mockGameState);
        });
      })
      .assert('attempts to save the data', (mockGameState) => {
        expect((databaseUtil.save as SinonSpy).args).to.eql([[mockGameState]]);
      })
      .assert('throws an error', (arranged, error) => {
        expect(error).to.be.an.instanceOf(Error);
        expect((error as Error).message).to.include('Database failed');
      });
  });
});
