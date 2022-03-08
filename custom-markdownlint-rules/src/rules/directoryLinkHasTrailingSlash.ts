import { URL } from 'url';
import { getFlattenedTokens } from '../utils/getFlattenedTokens';
import { getInputFileData } from '../utils/getInputFileData';
import { getLinkLintData } from '../utils/getLinkLintData';
import { CustomRule } from '../utils/types';

export const directoryLinkHasTrailingSlash: CustomRule = {
  names: ['directory-link-has-trailing-slash'],
  description: 'Links to directories must have a trailing slash.',
  information: new URL(
    'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#directory-link-has-trailing-slash',
  ),
  tags: ['links'],
  function: (params, onError): void => {
    const inputFileData = getInputFileData(params);
    const flattenedTokens = getFlattenedTokens(params);

    const allLintData = getLinkLintData(inputFileData, flattenedTokens);

    const directoriesMissingSlash = allLintData.filter(
      (lintData) =>
        lintData.isDirectoryLink && !lintData.referencePath.endsWith('/'),
    );

    directoriesMissingSlash.forEach((lintData) => {
      onError({
        lineNumber: lintData.lineNumber,
        detail: `Missing trailing slash "/" in directory link "${lintData.linkPath}"`,
        context: lintData.originalReference,
        range: lintData.linkPathRange,
      });
    });
  },
};
