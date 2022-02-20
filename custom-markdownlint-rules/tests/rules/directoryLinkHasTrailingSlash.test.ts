import { directoryLinkHasTrailingSlash } from '../../src/rules/directoryLinkHasTrailingSlash';
import { testRule } from '../testRule';

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

testRule(directoryLinkHasTrailingSlash, expectedErrors);
