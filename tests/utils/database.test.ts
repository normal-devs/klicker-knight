import { expect } from 'chai';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { Database } from '../../src/utils/database';

const database = new Database();

describe('database', () => {
  context('hasGameFile', () => {
    context('when file exists', () => {
      before(function () {
        writeFileSync('saves/data.json', '');
      });
      after(function () {
        unlinkSync('saves/data.json');
      });
      it('expect hasGameFile to return true', async () => {
        const returnValue = await database.hasGameFile();
        expect(returnValue).to.equal(true);
      });
    });
    context('when file exists - using file path override', () => {
      before(function () {
        writeFileSync('saves/dataTest.json', '');
      });
      after(function () {
        unlinkSync('saves/dataTest.json');
      });
      it('expect hasGameFile to return true', async () => {
        const returnValue = await database.hasGameFile('saves/dataTest.json');
        expect(returnValue).to.equal(true);
      });
    });
    context('when file does not exist', () => {
      it('expect hasGameFile to return false', async () => {
        const returnValue = await database.hasGameFile('saves/dataTest.json');
        expect(returnValue).to.equal(false);
      });
    });
  });
  context('load', () => {
    context('when file exists and has data', () => {
      before(function () {
        writeFileSync('saves/data.json', JSON.stringify({ foo: 'bar' }));
      });
      after(function () {
        unlinkSync('saves/data.json');
      });
      it('expect load to return data', async () => {
        const returnValue = await database.load();
        expect(returnValue).to.eql({ foo: 'bar' });
      });
    });
    context('when file exists and has data - using file path override', () => {
      before(function () {
        writeFileSync('saves/dataTest.json', JSON.stringify({ foo: 'bar' }));
      });
      after(function () {
        unlinkSync('saves/dataTest.json');
      });
      it('expect load to return data', async () => {
        const returnValue = await database.load('saves/dataTest.json');
        expect(returnValue).to.eql({ foo: 'bar' });
      });
    });
    context('when file exists and has no data', () => {
      before(function () {
        writeFileSync('saves/data.json', '');
      });
      after(function () {
        unlinkSync('saves/data.json');
      });
      it('expect load to return error', async () => {
        const returnValue = await database.load();
        expect(returnValue).to.have.own.property('error');
      });
    });
    context('when file does not exist', () => {
      it('expect load to return error', async () => {
        const returnValue = await database.load();
        expect(returnValue).to.have.own.property('error');
      });
    });
  });
  context('save', () => {
    context('when file exists and is being saved with valid data', () => {
      before(function () {
        writeFileSync('saves/data.json', JSON.stringify({ foo: 'bar' }));
      });
      after(function () {
        unlinkSync('saves/data.json');
      });
      it('expect save to save data', () => {
        database.save({ foo: 'foo' });
        const returnValue = readFileSync('saves/data.json', 'utf-8');
        expect(JSON.parse(returnValue)).to.eql({ foo: 'foo' });
      });
    });
    context(
      'when file does not exist and is being saved with valid data',
      () => {
        after(function () {
          unlinkSync('saves/data.json');
        });
        it('expect save to save data', () => {
          database.save({ foo: 'foo' });
          const returnValue = readFileSync('saves/data.json', 'utf-8');
          expect(JSON.parse(returnValue)).to.eql({ foo: 'foo' });
        });
      }
    );
    context(
      'when file exists and is being saved with valid data - using file path override',
      () => {
        before(function () {
          writeFileSync('saves/dataTest.json', JSON.stringify({ foo: 'bar' }));
        });
        after(function () {
          unlinkSync('saves/dataTest.json');
        });
        it('expect save to save data', () => {
          database.save({ foo: 'foo' }, 'saves/dataTest.json');
          const returnValue = readFileSync('saves/dataTest.json', 'utf-8');
          expect(JSON.parse(returnValue)).to.eql({ foo: 'foo' });
        });
      }
    );
  });
  context('delete', () => {
    context('when file exists', () => {
      before(function () {
        writeFileSync('saves/data.json', JSON.stringify({ foo: 'bar' }));
      });
      it('expect delete to remove file', () => {
        const returnValue = database.delete();
        expect(returnValue).to.equal(true);
        expect(existsSync('saves/data.json')).to.eql(false);
      });
    });
    context('when file exists - using file path override', () => {
      before(function () {
        writeFileSync('saves/dataTest.json', JSON.stringify({ foo: 'bar' }));
      });
      it('expect delete to remove file', () => {
        const returnValue = database.delete('saves/dataTest.json');
        expect(returnValue).to.equal(true);
        expect(existsSync('saves/data.json')).to.eql(false);
      });
    });
    context('when file does not exists', () => {
      before(function () {
        expect(existsSync('saves/data.json')).to.eql(false);
      });
      it('expect delete to not fail', () => {
        const returnValue = database.delete();
        expect(returnValue).to.equal(false);
      });
    });
  });
});
