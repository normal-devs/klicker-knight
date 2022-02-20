import { expect } from 'chai';
import markdownlint, { LintError } from 'markdownlint';
import fs from 'fs';
import { directoryLinkHasTrailingSlash } from '../../src/rules/directoryLinkHasTrailingSlash';

const testInputDirectory =
  'custom-markdownlint-rules/tests/test-input/directory-link-has-trailing-slash/';
const [ruleName] = directoryLinkHasTrailingSlash.names;

const hasOneTupleEntry = <T1, T2>(entries: [T1, T2][]): entries is [[T1, T2]] =>
  entries.length === 1;

// TODO: move to reusable test helper
const testFile = (fileName: string): LintError[] => {
  const lintResults = markdownlint.sync({
    customRules: [directoryLinkHasTrailingSlash],
    files: [`${testInputDirectory}${fileName}`],
  });

  const resultEntries = Object.entries(lintResults);
  if (!hasOneTupleEntry(resultEntries)) {
    throw Error(
      `Unexpected number of results "${resultEntries.length}" for one input file.`,
    );
  }

  const [[, lintErrors]] = resultEntries;
  return lintErrors;
};

const parseCaseDescription = (fileName: string) => ({
  fileName,
  caseDescription: fileName.replace(/([A-Z])/g, ' $1').toLowerCase(),
});

const validCases = fs
  .readdirSync(`${testInputDirectory}valid`)
  .map(parseCaseDescription);
const invalidCases = fs
  .readdirSync(`${testInputDirectory}invalid`)
  .map(parseCaseDescription);
const ignoredCases = fs
  .readdirSync(`${testInputDirectory}ignored`)
  .map(parseCaseDescription);

const expectedErrors: Record<string, undefined | object> = {
  aLinkWithAMissingTrailingSlash: {
    ruleNames: ['directory-link-has-trailing-slash'],
    ruleDescription: 'Links to directories must have a trailing slash.',
    ruleInformation:
      'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#directory-link-has-trailing-slash',
    errorDetail:
      'Missing trailing slash "/" in directory link "../mocks/mock-dir"',
    errorContext: '../mocks/mock-dir',
    lineNumber: 3,
    errorRange: [23, 17],
  },
};

describe(ruleName, () => {
  describe('it does not return an error for:', () => {
    validCases.forEach(({ caseDescription, fileName }) => {
      it(caseDescription, () => {
        expect(testFile(`valid/${fileName}`)).to.eql([]);
      });
    });
  });

  describe('returns an error for:', () => {
    invalidCases.forEach(({ caseDescription, fileName }) => {
      it(caseDescription, () => {
        const expectedError = expectedErrors[fileName];

        if (expectedError === undefined) {
          throw Error(`Missing an expected error for file "${fileName}"`);
        }

        expect(testFile(`invalid/${fileName}`)).to.eql([expectedError]);
      });
    });
  });

  describe('ignores:', () => {
    ignoredCases.forEach(({ caseDescription, fileName }) => {
      it(caseDescription, () => {
        expect(testFile(`ignored/${fileName}`)).to.eql([]);
      });
    });
  });
});
