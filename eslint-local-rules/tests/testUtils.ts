import { RuleTester } from 'eslint';
import parser from '@typescript-eslint/parser';

export const ruleTester = new RuleTester({
  parser,
});
