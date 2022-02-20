import { Rule } from 'markdownlint';
import { URL } from 'url';
import { getFlattenedTokens } from '../utils/getFlattenedTokens';
import { getInputFileData } from '../utils/getInputFileData';
import { AnchorLintData, getLinkLintData } from '../utils/getLinkLintData';

export const validAnchorReference: Rule = {
  names: ['valid-anchor-reference'],
  description: 'Anchor references must be valid.',
  information: new URL(
    'https://github.com/normal-devs/klicker-knight/tree/main/custom-markdownlint-rules/README.md#valid-anchor-reference',
  ),
  tags: ['links'],
  function: (params, onError): void => {
    const inputFileData = getInputFileData(params);
    const flattenedTokens = getFlattenedTokens(params);

    const allLintData = getLinkLintData(inputFileData, flattenedTokens);

    const invalidAnchorReferences = allLintData.filter(
      (lintData): lintData is AnchorLintData =>
        lintData.isReferenceOnDisk &&
        lintData.hasAnchorReference &&
        !lintData.isValidAnchorReference,
    );

    invalidAnchorReferences.forEach((linkData) => {
      onError({
        lineNumber: linkData.lineNumber,
        detail: `Unable to find anchor reference "${linkData.linkAnchorReference}" in resolved path "${linkData.referencePath}"`,
        context: linkData.originalReference,
        range: linkData.linkAnchorRange,
      });
    });
  },
};
