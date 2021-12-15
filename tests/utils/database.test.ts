import { expect } from 'chai';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';

import { databaseUtil } from '../../src/utils/database';

describe('hasGameFile', () => {
  context('when file exists', () => {
    before(function () {
      writeFileSync('saves/data.json', '');
    });
    after(function () {
      unlinkSync('saves/data.json');
    });
    it('expect hasGameFile to return true', () => {
      expect(databaseUtil.hasGameFile()).to.equal(true);
    });
  });
  context('when file does not exist', () => {
    it('expect hasGameFile to return false', () => {
      expect(databaseUtil.hasGameFile()).to.equal(false);
    });
  });
});

describe('load', () => {
  context('when file exists and has data', () => {
    before(function () {
      writeFileSync('saves/data.json', JSON.stringify({ foo: 'bar' }));
    });
    after(function () {
      unlinkSync('saves/data.json');
    });
    it('expect load to return data', () => {
      const returnValue = databaseUtil.load();
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
    it('expect load to return error', () => {
      expect(databaseUtil.load()).to.eql(null);
    });
  });
  context('when file does not exist', () => {
    it('expect load to return error', () => {
      expect(databaseUtil.load()).to.eql(null);
    });
  });
});

describe('save', () => {
  context('when file exists and is being saved with valid data', () => {
    before(function () {
      writeFileSync('saves/data.json', JSON.stringify({ foo: 'bar' }));
    });
    after(function () {
      unlinkSync('saves/data.json');
    });
    it('expect save to save data', () => {
      databaseUtil.save({ foo: 'foo' });
      const returnValue = readFileSync('saves/data.json', 'utf-8');
      expect(returnValue).to.eql('{"foo":"foo"}');
    });
  });
  context('when file does not exist and is being saved with valid data', () => {
    after(function () {
      unlinkSync('saves/data.json');
    });
    it('expect save to save data', () => {
      databaseUtil.save({ foo: 'foo' });
      const returnValue = readFileSync('saves/data.json', 'utf-8');
      expect(returnValue).to.eql('{"foo":"foo"}');
    });
  });
});

describe('delete', () => {
  context('when file exists', () => {
    before(function () {
      writeFileSync('saves/data.json', JSON.stringify({ foo: 'bar' }));
    });
    it('expect delete to remove file', () => {
      expect(databaseUtil.delete()).to.equal(true);
      expect(existsSync('saves/data.json')).to.eql(false);
    });
  });
  context('when file does not exists', () => {
    before(function () {
      expect(existsSync('saves/data.json')).to.eql(false);
    });
    it('expect delete to not fail', () => {
      expect(databaseUtil.delete()).to.equal(false);
    });
  });
});
