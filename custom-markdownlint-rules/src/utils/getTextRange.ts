const escapeStringForRegularExpression = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Range is defined as 1-based start and length: https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md#authoring
export const getTextRange = (
  line: string,
  subtext: string,
): [number, number] => {
  const match = line.match(escapeStringForRegularExpression(subtext));
  if (match === null) {
    throw Error(`Could not find "${subtext}" in "${line}" `);
  }

  if (match.index === undefined) {
    throw Error(`Missing match index for "${subtext}" in "${line}" `);
  }

  const range = [match.index + 1, subtext.length] as [number, number];
  return range;
};
