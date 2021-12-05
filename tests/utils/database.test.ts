/* eslint-disable mocha/no-hooks-for-single-case */
/* eslint-disable func-names */
import { expect } from 'chai';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { Database } from '../../src/utils/database';

const database = new Database();

describe('database', () => {
  context('hasGameFile', () => {
    context('when file exists', () => {
      before(async function () {
        await writeFileSync('src/utils/data.json', '');
      });
      after(async function () {
        await unlinkSync('src/utils/data.json');
      });
      it('expect hasGameFile to return true', async () => {
        const returnValue = await database.hasGameFile();
        expect(returnValue).to.equal(true);
      });
    });
    context('when file exists - using file path over ride', () => {
      before(async function () {
        await writeFileSync('src/utils/dataTest.json', '');
      });
      after(async function () {
        await unlinkSync('src/utils/dataTest.json');
      });
      it('expect hasGameFile to return true', async () => {
        const returnValue = await database.hasGameFile(
          'src/utils/dataTest.json'
        );
        expect(returnValue).to.equal(true);
      });
    });
    context('when file does not exist', () => {
      it('expect hasGameFile to return false', async () => {
        const returnValue = await database.hasGameFile(
          'src/utils/dataTest.json'
        );
        expect(returnValue).to.equal(false);
      });
    });
  });
  context('load', () => {
    context('when file exists and has data', () => {
      before(async function () {
        await writeFileSync(
          'src/utils/data.json',
          JSON.stringify({ foo: 'bar' })
        );
      });
      after(async function () {
        await unlinkSync('src/utils/data.json');
      });
      it('expect load to return data', async () => {
        const returnValue = await database.load();
        expect(returnValue).to.eql({ foo: 'bar' });
      });
    });
    context('when file exists and has data - using file path over ride', () => {
      before(async function () {
        await writeFileSync(
          'src/utils/dataTest.json',
          JSON.stringify({ foo: 'bar' })
        );
      });
      after(async function () {
        await unlinkSync('src/utils/dataTest.json');
      });
      it('expect load to return data', async () => {
        const returnValue = await database.load('src/utils/dataTest.json');
        expect(returnValue).to.eql({ foo: 'bar' });
      });
    });
    context('when file exists and has no data', () => {
      before(async function () {
        await writeFileSync('src/utils/data.json', '');
      });
      after(async function () {
        await unlinkSync('src/utils/data.json');
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
      before(async function () {
        await writeFileSync(
          'src/utils/data.json',
          JSON.stringify({ foo: 'bar' })
        );
      });
      after(async function () {
        await unlinkSync('src/utils/data.json');
      });
      it('expect save to save data', async () => {
        await database.save({ foo: 'foo' });
        const returnValue = await readFileSync('src/utils/data.json', 'utf-8');
        expect(JSON.parse(returnValue)).to.eql({ foo: 'foo' });
      });
    });
    context(
      'when file does not exist and is being saved with valid data',
      () => {
        after(async function () {
          await unlinkSync('src/utils/data.json');
        });
        it('expect save to save data', async () => {
          await database.save({ foo: 'foo' });
          const returnValue = await readFileSync(
            'src/utils/data.json',
            'utf-8'
          );
          expect(JSON.parse(returnValue)).to.eql({ foo: 'foo' });
        });
      }
    );
    context(
      'when file exists and is being saved with valid data - using file path over ride',
      () => {
        before(async function () {
          await writeFileSync(
            'src/utils/dataTest.json',
            JSON.stringify({ foo: 'bar' })
          );
        });
        after(async function () {
          await unlinkSync('src/utils/dataTest.json');
        });
        it('expect save to save data', async () => {
          await database.save({ foo: 'foo' }, 'src/utils/dataTest.json');
          const returnValue = await readFileSync(
            'src/utils/dataTest.json',
            'utf-8'
          );
          expect(JSON.parse(returnValue)).to.eql({ foo: 'foo' });
        });
      }
    );
  });
  context('delete', () => {
    context('when file exists', () => {
      before(async function () {
        await writeFileSync(
          'src/utils/data.json',
          JSON.stringify({ foo: 'bar' })
        );
      });
      it('expect delete to remove file', async () => {
        await database.delete();
        expect(existsSync('src/utils/data.json')).to.eql(false);
      });
    });
    context('when file exists - using file path over ride', () => {
      before(async function () {
        await writeFileSync(
          'src/utils/dataTest.json',
          JSON.stringify({ foo: 'bar' })
        );
      });
      it('expect delete to remove file', async () => {
        await database.delete('src/utils/dataTest.json');
        expect(existsSync('src/utils/data.json')).to.eql(false);
      });
    });
    context('when file does not exists', () => {
      it('expect delete to not fail', async () => {
        await database.delete();
        expect(existsSync('src/utils/data.json')).to.eql(false);
      });
    });
  });
});
