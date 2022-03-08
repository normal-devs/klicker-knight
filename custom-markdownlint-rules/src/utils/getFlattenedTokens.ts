import { MarkdownItToken, RuleParams } from 'markdownlint';

const flattenTokensTailOptimized = (
  someTokens: MarkdownItToken[],
  allTokens: MarkdownItToken[],
): void => {
  someTokens.forEach((token) => {
    allTokens.push(token);

    if (token.children !== null) {
      flattenTokensTailOptimized(token.children, allTokens);
    }
  });
};

export const getFlattenedTokens = (params: RuleParams): MarkdownItToken[] => {
  const allTokens: MarkdownItToken[] = [];
  flattenTokensTailOptimized(params.tokens, allTokens);
  return allTokens;
};
