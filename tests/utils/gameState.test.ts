import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { databaseUtil } from '../../src/utils/databaseUtil';
import { gameStateUtil } from '../../src/utils/gameStateUtil';
import { GameState } from '../../src/utils/gameStateSchema';
import { generateGameState } from '../testHelpers/generateGameState';

describe('gameStateUtil', () => {
  describe('load', () => {
    context('when a valid game state exists', () => {
      let result: GameState;
      let mockGameState: GameState;
      before(() => {
        sinon.stub(databaseUtil, 'hasGameFile').returns(true);
        mockGameState = generateGameState();
        sinon.stub(databaseUtil, 'load').returns(mockGameState);
        sinon.stub(databaseUtil, 'save');
        result = gameStateUtil.load();
      });
      after(() => {
        sinon.restore();
      });

      it('returns the game state', () => {
        expect(result).to.eq(mockGameState);
      });

      it('does not save the new game state', () => {
        expect((databaseUtil.save as SinonSpy).called).to.eq(false);
      });
    });

    context('when the game state does not exist', () => {
      let result: GameState;
      before(() => {
        sinon.stub(databaseUtil, 'hasGameFile').returns(false);
        sinon.stub(databaseUtil, 'save');
        result = gameStateUtil.load();
      });
      after(() => {
        sinon.restore();
      });

      it('saves the new game state', () => {
        expect((databaseUtil.save as SinonSpy).called).to.eq(true);
        expect((databaseUtil.save as SinonSpy).args).to.eql([
          [
            {
              currentRoomId: null,
            },
          ],
        ]);
      });

      it('returns a new game state', () => {
        expect(result).to.eql({
          currentRoomId: null,
        });
      });
    });

    context('when the game state is invalid', () => {
      let result: GameState;
      before(() => {
        sinon.stub(databaseUtil, 'hasGameFile').returns(false);
        sinon.stub(databaseUtil, 'load').returns('not a game state');
        sinon.stub(databaseUtil, 'save');
        result = gameStateUtil.load();
      });
      after(() => {
        sinon.restore();
      });

      it('saves the new game state', () => {
        expect((databaseUtil.save as SinonSpy).called).to.eq(true);
        expect((databaseUtil.save as SinonSpy).args).to.eql([
          [
            {
              currentRoomId: null,
            },
          ],
        ]);
      });

      it('returns a new game state', () => {
        expect(result).to.eql({
          currentRoomId: null,
        });
      });
    });
  });
});
