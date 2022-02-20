import { Rule } from 'markdownlint';

export type CustomRule = Rule & {
  names: [string];
};
