import { URL } from 'url';
import { getFlattenedTokens } from '../utils/getFlattenedTokens';
import { getInputFileData } from '../utils/getInputFileData';
import { getLinkLintData } from '../utils/getLinkLintData';
import { CustomRule } from '../utils/types';

export const validFileReference: CustomRule = {
  names: ['valid-file-reference'],
  description: 'Relative file references must be valid.',
  information: new URL(
    'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#valid-file-reference',
  ),
  tags: ['links'],
  function: (params, onError): void => {
    const inputFileData = getInputFileData(params);
    const flattenedTokens = getFlattenedTokens(params);

    const allLintData = getLinkLintData(inputFileData, flattenedTokens);

    const missingFiles = allLintData.filter(
      ({ isReferenceOnDisk }) => !isReferenceOnDisk,
    );

    missingFiles.forEach((lintData) => {
      onError({
        lineNumber: lintData.lineNumber,
        detail: `Unable to resolve referenced path "${lintData.referencePath}"`,
        context: lintData.originalReference,
        range: lintData.linkPathRange,
      });
    });
  },
};
