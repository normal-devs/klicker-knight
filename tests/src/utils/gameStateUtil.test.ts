import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { databaseUtil } from '../../../src/utils/databaseUtil';
import { gameStateUtil } from '../../../src/utils/gameStateUtil';
import { generateGameState } from '../../testHelpers/generateGameState';
import { testSingletonModule } from '../../testHelpers/semanticMocha';
import { tryErrorable } from '../../testHelpers/tryErrorable';

testSingletonModule('utils/gameStateUtil', ({ testUnit }) => {
  testUnit('load', ({ testScenario }) => {
    testScenario('when a valid game state exists')
      .arrange(() => {
        sinon.stub(databaseUtil, 'hasGameFile').returns(true);
        const mockGameState = generateGameState();
        sinon.stub(databaseUtil, 'load').returns(mockGameState);
        sinon.stub(databaseUtil, 'save');

        return mockGameState;
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act(() => gameStateUtil.load())
      .assert('returns the game state', (mockGameState, result) => {
        expect(result).to.eq(mockGameState);
      })
      .assert('does not save the new game state', () => {
        expect((databaseUtil.save as SinonSpy).called).to.eq(false);
      });

    testScenario('when the game state does not exist')
      .arrange(() => {
        sinon.stub(databaseUtil, 'hasGameFile').returns(false);
        sinon.stub(databaseUtil, 'save');
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act(() => gameStateUtil.load())
      .assert('saves the new game state', () => {
        expect((databaseUtil.save as SinonSpy).args).to.eql([
          [
            {
              currentRoomId: null,
            },
          ],
        ]);
      })
      .assert('returns a new game state', (arranged, result) => {
        expect(result).to.eql({
          currentRoomId: null,
        });
      });

    testScenario('when the game state is invalid')
      .arrange(() => {
        sinon.stub(databaseUtil, 'hasGameFile').returns(false);
        sinon.stub(databaseUtil, 'load').returns('not a game state');
        sinon.stub(databaseUtil, 'save');
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act(() => gameStateUtil.load())
      .assert('saves the new game state', () => {
        expect((databaseUtil.save as SinonSpy).args).to.eql([
          [
            {
              currentRoomId: null,
            },
          ],
        ]);
      })
      .assert('returns a new game state', (arranged, result) => {
        expect(result).to.eql({
          currentRoomId: null,
        });
      });
  });

  testUnit('save', ({ testScenario }) => {
    testScenario('when given a valid game state')
      .arrange(() => {
        sinon.stub(databaseUtil, 'save');
        return generateGameState();
      })
      .annihilate(() => {
        sinon.restore();
      })
      .act((mockGameState) => gameStateUtil.save(mockGameState))
      .assert('saves the game state', (mockGameState) => {
        expect((databaseUtil.save as SinonSpy).args).to.eql([
          [
            {
              currentRoomId: null,
            },
          ],
        ]);
      });

    testScenario('when given an invalid game state')
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
      })
      .assert('does not save the game', () => {
        expect((databaseUtil.save as SinonSpy).called).to.eq(false);
      });
  });
});
