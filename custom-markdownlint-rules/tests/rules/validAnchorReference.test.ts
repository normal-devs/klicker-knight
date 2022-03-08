import { validAnchorReference } from '../../src/rules/validAnchorReference';
import { testRule } from '../testRule';

const expectedErrors: Record<string, undefined | object> = {
  aLinkToAMissingExternalAnchor: {
    ruleNames: ['valid-anchor-reference'],
    ruleDescription: 'Anchor references must be valid.',
    ruleInformation:
      'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#valid-anchor-reference',
    errorDetail:
      'Unable to find anchor reference "third-heading" in resolved path "custom-markdownlint-rules/tests/test-input/valid-anchor-reference/mocks/mock-external-file.md"',
    errorContext: '../mocks/mock-external-file.md#third-heading',
    lineNumber: 3,
    errorRange: [53, 13],
  },
  aLinkToAMissingInternalAnchor: {
    ruleNames: ['valid-anchor-reference'],
    ruleDescription: 'Anchor references must be valid.',
    ruleInformation:
      'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#valid-anchor-reference',
    errorDetail:
      'Unable to find anchor reference "sub-heading" in resolved path "custom-markdownlint-rules/tests/test-input/valid-anchor-reference/invalid/aLinkToAMissingInternalAnchor"',
    errorContext: '#sub-heading',
    lineNumber: 3,
    errorRange: [21, 11],
  },
};

testRule(validAnchorReference, expectedErrors);
