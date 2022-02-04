import { Rule } from 'eslint';

type CustomRule<T> = {
  name: T;
  module: Rule.RuleModule;
};

export const createCustomRule = <T extends string>(
  name: T,
  module: Rule.RuleModule,
): CustomRule<T> => ({
  name,
  module,
});
