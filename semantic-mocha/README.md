# Semantic Mocha

Wraps mocha in an opinionated framework to provide a rigid structure for tests.
The library is a work in progress and will need to be modified as new use cases arise.

- [Roadmap](#roadmap)
- [Current API](#current-api)

## Roadmap

- Eventually move this project to its own repository
- Split the index file into separate modules
- Create an extensible framework to apply custom patterns
- Abstract the core wrapping logic to be independent of the testing framework
- Combine the documentation with the source code for easier maintenance

## Current API

Start with importing `testModule` or `testSingletonModule`.

### ModuleSuiteRegistrant

Registers a suite of tests for a module. Takes a callback to register suites for exported members.

```ts
type ModuleSuiteRegistrant =
  (description: string, (suite: ModuleSuite) => void) => void;

export const testModule: ModuleSuiteRegistrant;
```

### SingletonModuleSuiteRegistrant

Registers a suite of tests for a module that has one usable export.
Takes a callback to register tests for the export,
or to register a suite of tests for units within the export.

```ts
type SingletonModuleSuiteRegistrant =
  (description: string, (suite: ExportSuite) => void) => void;

export const testSingletonModule: SingletonModuleSuiteRegistrant;
```

### ModuleSuite

Enables registering multiple test suites for exported members of a module.

```ts
type ModuleSuite = {
  testExport: ExportSuiteRegistrant;
}
```

### ExportSuite

Enables registering tests for an exported member of a module,
or to register a suite of tests for units within the export.

```ts
type ExportSuite = {
  testUnit: UnitSuiteRegistrant;
  assert: AssertionRegistrant;
  testScenario: ScenarioRegistrant;
}
```

### UnitSuiteRegistrant

Enables registering tests for a unit of an export of a module.

```ts
type ExportSuite = {
  assert: AssertionRegistrant;
  testScenario: ScenarioRegistrant;
}
```

### AssertionRegistrant

Registers a single assertion for a unit. Useful for testing pure functions.
Use the callback to make an assertion. Throwing an error from the callback counts as a failed assertion.

```ts
type AssertionRegistrant = (description: string, () => void) => void;
```

### ScenarioRegistrant

Registers a test case for a unit. Returns functions for registering parts of the test case.
Useful for combining assertions on a single action, or controlling tests with side effects.

```ts
type ScenarioRegistrant = (description: string) => {
  arrange: ArrangeRegistrant;
  annihilate: AnnihilateRegistrant;
  act: ActRegistrant;
};
```

### ArrangeRegistrant

Registers the setup for a test case.
Anything returned by the callback can be used in later steps.
The callback is run before anything else in the test case.

```ts
type ArrangeRegistrant = <TArranged>(description: string, () => TArranged) => {
  annihilate: AnnihilateRegistrant;
  act: ActRegistrant;
};
```

### AnnihilateRegistrant

Registers the teardown for a test case.
The callback is run at the end of the test case regardless of success or failure.

```ts
type AnnihilateRegistrant<TArranged> =
  (description: string, (arranged: TArranged) => void) => {
  act: ActRegistrant;
};
```

### ActRegistrant

Enables separating the concept under test from the test case setup.
Anything returned by this callback can be used by assertions.
The callback runs after the arrange callback if one is provided.

```ts
type ActRegistrant<TArranged> =
  <TResult>(description: string, (arranged: TArranged) => TResult) => {
  assert: ChainableAssertionRegistrant;
};
```

### ChainableAssertionRegistrant

Enables chaining multiple independent assertions for one test case.
Assertions should not have any side effects.
The callback runs after the act callback or the previous chained assertion callback.
The callback has access to any data returned by the arrange and act steps.
Throwing an error from the callback counts as a failed assertion.

```ts
type ChainableAssertionRegistrant<TArranged, TResult> =
  (description: string, (arranged: TArranged, result: TResult) => void) => {
  assert: ChainableAssertionRegistrant;
};
```
