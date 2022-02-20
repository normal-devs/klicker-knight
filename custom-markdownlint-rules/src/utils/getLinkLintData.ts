import { MarkdownItToken } from 'markdownlint';
import { posix } from 'path';
import fs from 'fs';
import { InputFileData } from './getInputFileData';
import { getTextRange } from './getTextRange';

type CommonLinkData = {
  originalReference: string;
  linkPath: string;
  isHttpLink: boolean;
  lineNumber: number;
  linkPathRange: [number, number];
};

type AnchorLinkData = CommonLinkData & {
  linkAnchorReference: string;
  hasAnchorReference: true;
  linkAnchorRange: [number, number];
};

type NonAnchorLinkData = CommonLinkData & {
  linkAnchorReference: null;
  hasAnchorReference: false;
  linkAnchorRange: null;
};

type LinkData = AnchorLinkData | NonAnchorLinkData;

type CommonLintData = {
  referencePath: string;
  isReferenceOnDisk: boolean;
  isFileLink: boolean;
  isDirectoryLink: boolean;
};

export type AnchorLintData = AnchorLinkData &
  CommonLintData & {
    isValidAnchorReference: boolean;
    referencedFileContents: string | null;
  };

export type NonAnchorLintData = NonAnchorLinkData &
  CommonLintData & {
    isValidAnchorReference: null;
  };

type LintData = AnchorLintData | NonAnchorLintData;

const getLinkData = (
  { inputFileName }: InputFileData,
  token: MarkdownItToken,
): LinkData => {
  const { lineNumber } = token;
  const hrefAttributeTuple = token.attrs.find(([name]) => name === 'href') as
    | undefined
    | [string, string];

  if (hrefAttributeTuple === undefined) {
    throw Error('Unhandled token without href');
  }

  const [, originalReference] = hrefAttributeTuple;

  const isHttpLink = /http(s)?:\/\//.test(originalReference);
  const hasAnchorReference = originalReference.includes('#');

  if (hasAnchorReference) {
    const [pathPart, anchorPart] = originalReference.split('#');

    if (pathPart === undefined || anchorPart === undefined) {
      throw Error(`Unhandled anchor reference: ${originalReference}`);
    }

    // Example: "[Internal Header](#internal-header)" (reference === "#internal-header")
    const isInSameFile = pathPart === '';

    return {
      originalReference,
      linkPath: isInSameFile ? inputFileName : pathPart,
      linkAnchorReference: anchorPart,
      hasAnchorReference,
      isHttpLink,
      lineNumber,
      linkPathRange: getTextRange(token.line, pathPart),
      linkAnchorRange: getTextRange(token.line, anchorPart),
    };
  }

  return {
    originalReference,
    linkPath: originalReference,
    linkAnchorReference: null,
    hasAnchorReference: false,
    isHttpLink,
    lineNumber,
    linkPathRange: getTextRange(token.line, originalReference),
    linkAnchorRange: null,
  };
};

const getLintData = (
  { inputDirectoryPath }: InputFileData,
  linkData: LinkData,
): LintData => {
  const { linkPath, hasAnchorReference } = linkData;
  const referencePath = posix.normalize(`./${inputDirectoryPath}/${linkPath}`);

  const isReferenceOnDisk = fs.existsSync(referencePath);
  const isFileLink =
    isReferenceOnDisk && !fs.statSync(referencePath).isDirectory();
  const isDirectoryLink = isReferenceOnDisk && !isFileLink;

  if (!hasAnchorReference) {
    return {
      ...linkData,
      referencePath,
      isReferenceOnDisk,
      isFileLink,
      isDirectoryLink,
      isValidAnchorReference: null,
    };
  }

  const { linkAnchorReference } = linkData;

  const referencedFileContents =
    linkData.hasAnchorReference && isFileLink
      ? fs.readFileSync(referencePath, 'utf8')
      : null;

  const anchorSearchText = linkAnchorReference.replace(/-/g, ' ');
  const isValidAnchorReference =
    referencedFileContents !== null &&
    new RegExp(`# ${anchorSearchText}`, 'i').test(referencedFileContents);

  return {
    ...linkData,
    referencePath,
    isReferenceOnDisk,
    isFileLink,
    isDirectoryLink,
    isValidAnchorReference,
    referencedFileContents,
  };
};

export const getLinkLintData = (
  inputFileData: InputFileData,
  flattenedTokens: MarkdownItToken[],
): LintData[] => {
  const allLinkLintData = flattenedTokens
    .filter((token) => token.type === 'link_open')
    .map((token) => getLinkData(inputFileData, token))
    .filter(({ isHttpLink }) => !isHttpLink)
    .map((linkData) => getLintData(inputFileData, linkData));

  return allLinkLintData;
};
