/* eslint-disable mocha/no-exports */

import markdownlint, { LintError } from 'markdownlint';
import fs from 'fs';
import { expect } from 'chai';
import { CustomRule } from '../src/utils/types';

const hasOneTupleEntry = <T1, T2>(entries: [T1, T2][]): entries is [[T1, T2]] =>
  entries.length === 1;

type RuleCase = {
  fileName: string;
  filePath: string;
  caseDescription: string;
};

const getCases = (directoryPath: string): RuleCase[] =>
  fs.readdirSync(directoryPath).map((fileName) => ({
    filePath: `${directoryPath}${fileName}`,
    fileName,
    caseDescription: fileName.replace(/([A-Z])/g, ' $1').toLowerCase(),
  }));

export const testRule = (
  rule: CustomRule,
  expectedErrors: Record<string, undefined | object>,
): void => {
  const [ruleName] = rule.names;
  const testInputDirectory = `custom-markdownlint-rules/tests/test-input/${ruleName}/`;

  if (!fs.existsSync(testInputDirectory)) {
    throw Error(`Unable to find test input directory "${testInputDirectory}"`);
  }

  const validCases = getCases(`${testInputDirectory}valid/`);
  const invalidCases = getCases(`${testInputDirectory}invalid/`);
  const ignoredCases = (() => {
    const directoryPath = `${testInputDirectory}ignored/`;
    return fs.existsSync(directoryPath) ? getCases(directoryPath) : [];
  })();

  const getFileErrors = (filePath: string): LintError[] => {
    const lintResults = markdownlint.sync({
      customRules: [rule],
      files: [filePath],
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

  describe(ruleName, () => {
    describe('it does not return an error for:', () => {
      validCases.forEach(({ caseDescription, filePath }) => {
        it(caseDescription, () => {
          expect(getFileErrors(filePath)).to.eql([]);
        });
      });
    });

    describe('returns an error for:', () => {
      invalidCases.forEach(({ caseDescription, fileName, filePath }) => {
        it(caseDescription, () => {
          const expectedError = expectedErrors[fileName];

          if (expectedError === undefined) {
            throw Error(`Missing an expected error for file "${fileName}"`);
          }

          expect(getFileErrors(filePath)).to.eql([expectedError]);
        });
      });
    });

    describe('ignores:', () => {
      ignoredCases.forEach(({ caseDescription, filePath }) => {
        it(caseDescription, () => {
          expect(getFileErrors(filePath)).to.eql([]);
        });
      });
    });
  });
};
