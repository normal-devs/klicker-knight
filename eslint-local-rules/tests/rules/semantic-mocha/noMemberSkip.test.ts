import { ruleTester } from '../../testUtils';
import { semanticMochaNoMemberSkip } from '../../../src/semantic-mocha/noMemberSkip';

ruleTester.run(
  semanticMochaNoMemberSkip.name,
  semanticMochaNoMemberSkip.module,
  {
    valid: [
      {
        code: `// A CallExpression on a MemberExpression where the property is not "skip"
        whatever.anything()`,
      },
    ],
    invalid: [
      {
        code: `// A CallExpression on a semantic-mocha-like MemberExpression where the property is "skip"
        testModule.skip();
      `,
        errors: [
          {
            messageId: 'noSkip',
          },
        ],
      },
      {
        code: `// A CallExpression on a MemberExpression where the property is "skip"
        anything.skip();
      `,
        errors: [
          {
            messageId: 'noSkip',
          },
        ],
      },
    ],
  },
);
