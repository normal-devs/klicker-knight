import { validFileReference } from '../../src/rules/validFileReference';
import { testRule } from '../testRule';

const expectedErrors: Record<string, undefined | object> = {
  aLinkMissingAFileExtension: {
    ruleNames: ['valid-file-reference'],
    ruleDescription: 'Relative file references must be valid.',
    ruleInformation:
      'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#valid-file-reference',
    errorDetail:
      'Unable to resolve referenced path "custom-markdownlint-rules/tests/test-input/valid-file-reference/mocks/mock"',
    errorContext: '../mocks/mock',
    lineNumber: 3,
    errorRange: [17, 13],
  },
  aLinkToAMissingFile: {
    ruleNames: ['valid-file-reference'],
    ruleDescription: 'Relative file references must be valid.',
    ruleInformation:
      'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#valid-file-reference',
    errorDetail:
      'Unable to resolve referenced path "custom-markdownlint-rules/tests/test-input/valid-file-reference/invalid/foo"',
    errorContext: './foo',
    lineNumber: 3,
    errorRange: [10, 5],
  },
};

testRule(validFileReference, expectedErrors);
