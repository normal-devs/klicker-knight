import { semanticMochaNoMemberOnly } from './semantic-mocha/noMemberOnly';
import { semanticMochaNoMemberSkip } from './semantic-mocha/noMemberSkip';

// eslint-disable-next-line import/no-default-export
export default {
  [semanticMochaNoMemberOnly.name]: semanticMochaNoMemberOnly.module,
  [semanticMochaNoMemberSkip.name]: semanticMochaNoMemberSkip.module,
};
