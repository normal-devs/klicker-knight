const mochaDescribe = describe;
const mochaBefore = before;
const mochaAfter = after;
const mochaIt = it;

const noop = () => {};

// AssertionRegistrant
type AssertionRegistrant = (
  assertionDescription: string,
  onAssert: AssertionCallback,
) => void;

type AssertionCallback = () => void;

// ChainableAssertionRegistrant
type ChainableAssertionRegistrant<TArranged, TResult> = (
  assertionDescription: string,
  onAssert: ChainableAssertionCallback<TArranged, TResult>,
) => ScenarioAssertionBuilder<TArranged, TResult>;

type ChainableAssertionCallback<TArranged, TResult> = (
  arranged: TArranged,
  result: TResult,
) => void;

type ScenarioAssertionBuilder<TArranged, TResult> = {
  assert: ChainableAssertionRegistrant<TArranged, TResult>;
};

// ActRegistrant
type ActRegistrant<TArranged> = <TResult>(
  onAct: ActCallback<TArranged, TResult>,
) => ScenarioAssertionBuilder<TArranged, TResult>;

type ActCallback<TArranged, TResult> = (arranged: TArranged) => TResult;

// AnnihilateRegistrant
type AnnihilateRegistrant<TArranged> = (
  onAnnihilate: AnnihilateCallback<TArranged>,
) => AnnihilatedScenarioBuilder<TArranged>;

type AnnihilateCallback<TArranged> = (arranged: TArranged) => void;

type AnnihilatedScenarioBuilder<TArranged> = {
  act: ActRegistrant<TArranged>;
} & ScenarioAssertionBuilder<TArranged, void>;

// ArrangeRegistrant
type ArrangeRegistrant = <TArranged>(
  onArrange: ArrangeCallback<TArranged>,
) => ArrangedScenarioBuilder<TArranged>;

type ArrangeCallback<TArranged> = () => TArranged;

type ArrangedScenarioBuilder<TArranged> = {
  annihilate: AnnihilateRegistrant<TArranged>;
} & AnnihilatedScenarioBuilder<TArranged>;

// ScenarioRegistrant
type ScenarioRegistrant = (scenarioDescription: string) => ScenarioBuilder;

type ScenarioBuilder = {
  arrange: ArrangeRegistrant;
} & Omit<ArrangedScenarioBuilder<void>, 'annihilate'>;

// UnitSuiteRegistrant
type UnitSuiteRegistrant = (
  unitDescription: string,
  onUnitSuite: UnitSuiteRegistrantCallback,
) => void;

type UnitSuiteRegistrantCallback = (unitSuite: UnitSuite) => void;

type UnitSuite = {
  testScenario: ScenarioRegistrant;
  assert: AssertionRegistrant;
};

// ExportSuiteRegistrant
type ExportSuiteRegistrant = (
  moduleExportDescription: string,
  onExportSuite: ExportSuiteRegistrantCallback,
) => void;

type ExportSuiteRegistrantCallback = (exportSuite: ExportSuite) => void;

type ExportSuite = {
  testUnit: UnitSuiteRegistrant;
} & UnitSuite;

// ModuleSuiteRegistrant
type ModuleSuiteRegistrant = (
  relativeModulePath: string,
  onModuleSuite: ModuleSuiteRegistrantCallback,
) => void;

type ModuleSuiteRegistrantCallback = (moduleSuite: ModuleSuite) => void;

type ModuleSuite = {
  testExport: ExportSuiteRegistrant;
};

// SingletonModuleSuiteRegistrant
type SingletonModuleSuiteRegistrant = (
  relativeModulePath: string,
  onSingletonModuleSuite: SingletonModuleSuiteRegistrantCallback,
) => void;

type SingletonModuleSuiteRegistrantCallback = (
  exportSuite: ExportSuite,
) => void;

type GenericCallback = () => void;

// MochaConfig
type MochaFn = Mocha.SuiteFunction | Mocha.HookFunction | Mocha.TestFunction;

abstract class MochaConfig<T extends MochaFn> {
  constructor(public mochaFn: T, public description: string) {}

  abstract apply(): void;
}

class AssertionConfig extends MochaConfig<Mocha.TestFunction> {
  constructor(description: string, public onAssert: GenericCallback) {
    super(mochaIt, description);
  }

  apply(): void {
    this.mochaFn(this.description, this.onAssert);
  }
}

class HookConfig extends MochaConfig<Mocha.HookFunction> {
  constructor(
    mochaFn: Mocha.HookFunction,
    description: string,
    public onHook: GenericCallback,
  ) {
    super(mochaFn, description);
  }

  apply(): void {
    this.mochaFn(this.description, this.onHook);
  }
}

class SuiteConfig extends MochaConfig<Mocha.SuiteFunction> {
  public nested: MochaConfig<MochaFn>[] = [];

  constructor(public description: string) {
    super(mochaDescribe, description);
  }

  add(config: MochaConfig<MochaFn>) {
    this.nested.push(config);
  }

  apply() {
    this.mochaFn(this.description, () => {
      this.nested.forEach((innerConfig) => {
        innerConfig.apply();
      });
    });
  }
}

// Registrant Builders
const buildRegisterAssertion =
  (parentConfig: SuiteConfig): AssertionRegistrant =>
  (assertionDescription, onAssert) => {
    parentConfig.add(new AssertionConfig(assertionDescription, onAssert));
  };

const buildRegisterChainableAssertion = <TArranged, TResult>(
  parentConfig: SuiteConfig,
  getArranged: () => TArranged,
  getResult: () => TResult,
) => {
  const registerChainableAssertion: ChainableAssertionRegistrant<
    TArranged,
    TResult
  > = (
    assertionDescription,
    onAssert,
  ): ScenarioAssertionBuilder<TArranged, TResult> => {
    buildRegisterAssertion(parentConfig)(assertionDescription, () =>
      onAssert(getArranged(), getResult()),
    );

    return {
      assert: registerChainableAssertion,
    };
  };

  return registerChainableAssertion;
};

const buildActRegistrant =
  <TArranged>(
    parentConfig: SuiteConfig,
    getArranged: () => TArranged,
  ): ActRegistrant<TArranged> =>
  <TResult>(
    onAct: ActCallback<TArranged, TResult>,
  ): ScenarioAssertionBuilder<TArranged, TResult> => {
    let result: TResult;
    const getResult = () => result;
    const hookWrapper = () => {
      result = onAct(getArranged());
    };

    parentConfig.add(new HookConfig(mochaBefore, 'act', hookWrapper));

    return {
      assert: buildRegisterChainableAssertion<TArranged, TResult>(
        parentConfig,
        getArranged,
        getResult,
      ),
    };
  };

const buildAnnihilateRegistrant =
  <TArranged>(
    parentConfig: SuiteConfig,
    getArranged: () => TArranged,
  ): AnnihilateRegistrant<TArranged> =>
  (
    onAnnihilate: AnnihilateCallback<TArranged>,
  ): AnnihilatedScenarioBuilder<TArranged> => {
    const hookWrapper = () => onAnnihilate(getArranged());
    parentConfig.add(new HookConfig(mochaAfter, 'act', hookWrapper));

    return {
      act: buildActRegistrant<TArranged>(parentConfig, getArranged),
      assert: buildRegisterChainableAssertion<TArranged, void>(
        parentConfig,
        getArranged,
        noop,
      ),
    };
  };

const buildArrangeRegistrant =
  (parentConfig: SuiteConfig): ArrangeRegistrant =>
  <TArranged>(
    onArrange: ArrangeCallback<TArranged>,
  ): ArrangedScenarioBuilder<TArranged> => {
    let arranged: TArranged;
    const getArranged = () => arranged;
    const hookWrapper = () => {
      arranged = onArrange();
    };

    parentConfig.add(new HookConfig(mochaBefore, 'arrange', hookWrapper));

    return {
      annihilate: buildAnnihilateRegistrant<TArranged>(
        parentConfig,
        getArranged,
      ),
      act: buildActRegistrant<TArranged>(parentConfig, getArranged),
      assert: buildRegisterChainableAssertion<TArranged, void>(
        parentConfig,
        getArranged,
        noop,
      ),
    };
  };

const buildRegisterScenario =
  (parentConfig: SuiteConfig): ScenarioRegistrant =>
  (scenarioDescription): ScenarioBuilder => {
    const config = new SuiteConfig(scenarioDescription);
    parentConfig.add(config);

    return {
      arrange: buildArrangeRegistrant(config),
      act: buildActRegistrant<void>(config, noop),
      assert: buildRegisterChainableAssertion<void, void>(config, noop, noop),
    };
  };

const buildRegisterUnitSuite =
  (parentConfig: SuiteConfig): UnitSuiteRegistrant =>
  (unitDescription, onUnitSuite) => {
    const config = new SuiteConfig(unitDescription);
    parentConfig.add(config);

    const unitSuite: UnitSuite = {
      testScenario: buildRegisterScenario(config),
      assert: buildRegisterAssertion(config),
    };
    onUnitSuite(unitSuite);
  };

const buildExportSuite = (parentConfig: SuiteConfig) => ({
  testUnit: buildRegisterUnitSuite(parentConfig),
  testScenario: buildRegisterScenario(parentConfig),
  assert: buildRegisterAssertion(parentConfig),
});

const buildRegisterExportSuite =
  (parentConfig: SuiteConfig): ExportSuiteRegistrant =>
  (exportDescription, onExportSuite) => {
    const config = new SuiteConfig(exportDescription);
    parentConfig.add(config);
    onExportSuite(buildExportSuite(config));
  };

const registerModuleSuite: ModuleSuiteRegistrant = (
  relativeModulePath,
  onModuleSuite,
) => {
  const config = new SuiteConfig(relativeModulePath);
  const moduleSuite: ModuleSuite = {
    testExport: buildRegisterExportSuite(config),
  };

  onModuleSuite(moduleSuite);
  config.apply();
};

const registerSingletonModuleSuite: SingletonModuleSuiteRegistrant = (
  relativeModulePath,
  onSingletonModuleSuite,
) => {
  const config = new SuiteConfig(relativeModulePath);
  onSingletonModuleSuite(buildExportSuite(config));
  config.apply();
};

export const testModule = registerModuleSuite;
export const testSingletonModule = registerSingletonModuleSuite;
