import { testSingletonModule } from '../../testHelpers/semanticMocha';

testSingletonModule(
  'roomHandlers/ExampleRoom2Handler',
  ({ testIntegration }) => {
    // TODO: Create a utility to make state transition tests from mermaid code
    // TODO: fix and merge schema-to-generator issues
    testIntegration.skip('run', () => {});
  },
);
