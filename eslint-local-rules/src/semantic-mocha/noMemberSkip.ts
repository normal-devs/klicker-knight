import { Rule } from 'eslint';
import { createCustomRule } from '../utils';

export const semanticMochaNoMemberSkip = createCustomRule(
  'semantic-mocha/no-member-skip',
  {
    meta: {
      messages: {
        noSkip: 'Unexpected .skip call.',
      },
    },
    create(context: Rule.RuleContext) {
      return {
        CallExpression(node) {
          const { callee } = node;

          if (callee.type !== 'MemberExpression') {
            return;
          }

          if (callee.property.type !== 'Identifier') {
            return;
          }

          if (callee.property.name === 'skip') {
            context.report({
              node: callee.property,
              messageId: 'noSkip',
            });
          }
        },
      };
    },
  },
);
