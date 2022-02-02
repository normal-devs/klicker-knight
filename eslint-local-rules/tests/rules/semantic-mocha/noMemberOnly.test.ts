import { ruleTester } from '../../testUtils';
import { semanticMochaNoMemberOnly } from '../../../src/semantic-mocha/noMemberOnly';

ruleTester.run(
  semanticMochaNoMemberOnly.name,
  semanticMochaNoMemberOnly.module,
  {
    valid: [
      {
        code: `// A CallExpression on a MemberExpression where the property is not "only"
        whatever.anything()`,
      },
    ],
    invalid: [
      {
        code: `// A CallExpression on a semantic-mocha-like MemberExpression where the property is "only"
        testModule.only();
      `,
        errors: [
          {
            messageId: 'noOnly',
          },
        ],
      },
      {
        code: `// A CallExpression on a MemberExpression where the property is "only"
        anything.only();
      `,
        errors: [
          {
            messageId: 'noOnly',
          },
        ],
      },
    ],
  },
);
