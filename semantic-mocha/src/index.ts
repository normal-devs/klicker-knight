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
) => AssertedScenarioBuilder<TArranged, TResult>;

type ChainableAssertionCallback<TArranged, TResult> = (
  arranged: TArranged,
  result: TResult,
) => void;

type AssertedScenarioBuilder<TArranged, TResult> = ScenarioAssertBuilder<
  TArranged,
  TResult
>;

// ActRegistrant
type ActRegistrant<TArranged> = <TResult>(
  onAct: ActCallback<TArranged, TResult>,
) => ActionedScenarioBuilder<TArranged, TResult>;

type ActCallback<TArranged, TResult> = (arranged: TArranged) => TResult;

type ActionedScenarioBuilder<TArranged, TResult> = ScenarioAssertBuilder<
  TArranged,
  TResult
>;

// AnnihilateRegistrant
type AnnihilateRegistrant<TArranged> = (
  onAnnihilate: AnnihilateCallback<TArranged>,
) => AnnihilatedScenarioBuilder<TArranged>;

type AnnihilateCallback<TArranged> = (arranged: TArranged) => void;

type AnnihilatedScenarioBuilder<TArranged> = ScenarioActBuilder<TArranged>;

// ArrangeRegistrant
type ArrangeRegistrant = <TArranged>(
  onArrange: ArrangeCallback<TArranged>,
) => ArrangedScenarioBuilder<TArranged>;

type ArrangeCallback<TArranged> = () => TArranged;

type ArrangedScenarioBuilder<TArranged> = ScenarioAnnihilateBuilder<TArranged> &
  ScenarioActBuilder<TArranged>;

// ScenarioRegistrant
type ScenarioRegistrant = (scenarioDescription: string) => ScenarioBuilder;

// Scenario Builders
type ScenarioBuilder = ScenarioArrangeBuilder &
  ScenarioAnnihilateBuilder<void> &
  ScenarioActBuilder<void>;

type ScenarioArrangeBuilder = {
  arrange: ArrangeRegistrant;
};

type ScenarioActBuilder<TArranged> = {
  act: ActRegistrant<TArranged>;
};

type ScenarioAnnihilateBuilder<TArranged> = {
  annihilate: AnnihilateRegistrant<TArranged>;
};

type ScenarioAssertBuilder<TArranged, TResult> = {
  assert: MochafiedRegistrant<ChainableAssertionRegistrant<TArranged, TResult>>;
};

// Suites
type ExportParentSuite = {
  testExport: MochafiedRegistrant<ExportSuiteRegistrant>;
};

type IntegrationParentSuite = {
  testIntegration: MochafiedRegistrant<IntegrationSuiteRegistrant>;
};

type UnitParentSuite = {
  testUnit: MochafiedRegistrant<UnitSuiteRegistrant>;
};

type AssertableSuite = {
  assert: MochafiedRegistrant<AssertionRegistrant>;
};

type ScenarioableSuite = {
  testScenario: MochafiedRegistrant<ScenarioRegistrant>;
};

// UnitSuiteRegistrant
type UnitSuiteRegistrant = (
  unitDescription: string,
  onUnitSuite: UnitSuiteRegistrantCallback,
) => void;

type UnitSuiteRegistrantCallback = (unitSuite: UnitSuite) => void;

type UnitSuite = AssertableSuite & ScenarioableSuite;

// IntegrationSuiteRegistrant
type IntegrationSuiteRegistrant = (
  integrationDescription: string,
  onIntegrationSuite: IntegrationSuiteRegistrantCallback,
) => void;

type IntegrationSuiteRegistrantCallback = (
  integrationSuite: IntegrationSuite,
) => void;

type IntegrationSuite = ScenarioableSuite;

// ExportSuiteRegistrant
type ExportSuiteRegistrant = (
  moduleExportDescription: string,
  onExportSuite: ExportSuiteRegistrantCallback,
) => void;

type ExportSuiteRegistrantCallback = (exportSuite: ExportSuite) => void;

type ExportSuite = IntegrationParentSuite &
  UnitParentSuite &
  AssertableSuite &
  ScenarioableSuite;

// ModuleSuiteRegistrant
type ModuleSuiteRegistrant = (
  relativeModulePath: string,
  onModuleSuite: ModuleSuiteRegistrantCallback,
) => void;

type ModuleSuiteRegistrantCallback = (moduleSuite: ModuleSuite) => void;

type ModuleSuite = ExportParentSuite;

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
type MochaFunction =
  | MochaSuiteFunction
  | Mocha.HookFunction
  | MochaTestFunction;

type MochaSuiteFunction =
  | Mocha.SuiteFunction
  | Mocha.ExclusiveSuiteFunction
  | Mocha.PendingSuiteFunction;

type MochaTestFunction =
  | Mocha.TestFunction
  | Mocha.ExclusiveTestFunction
  | Mocha.PendingTestFunction;

abstract class MochaConfig<T extends MochaFunction> {
  constructor(public mochaFunction: T, public description: string) {}

  abstract apply(): void;
}

class AssertionConfig extends MochaConfig<MochaTestFunction> {
  constructor(
    mochaFunction: MochaTestFunction,
    description: string,
    public onAssert: GenericCallback,
  ) {
    super(mochaFunction, description);
  }

  apply(): void {
    this.mochaFunction(this.description, this.onAssert);
  }
}

class HookConfig extends MochaConfig<Mocha.HookFunction> {
  constructor(
    mochaFunction: Mocha.HookFunction,
    description: string,
    public onHook: GenericCallback,
  ) {
    super(mochaFunction, description);
  }

  apply(): void {
    this.mochaFunction(this.description, this.onHook);
  }
}

class SuiteConfig extends MochaConfig<MochaSuiteFunction> {
  public nested: MochaConfig<MochaFunction>[] = [];

  constructor(mochaFunction: MochaSuiteFunction, public description: string) {
    super(mochaFunction, description);
  }

  add(config: MochaConfig<MochaFunction>) {
    this.nested.push(config);
  }

  apply() {
    this.mochaFunction(this.description, () => {
      this.nested.forEach((innerConfig) => {
        innerConfig.apply();
      });
    });
  }
}

// Mochafy
const mochafyRegistrant = <
  TMochaFunction extends Mocha.SuiteFunction | Mocha.TestFunction,
  TRegistrant,
>(
  mochaFunction: TMochaFunction,
  registrantBuilder: (
    mochaFunction: RelatedMochaFunction<TMochaFunction>,
  ) => TRegistrant,
): MochafiedRegistrant<TRegistrant> =>
  Object.assign(
    registrantBuilder(mochaFunction as RelatedMochaFunction<TMochaFunction>),
    {
      only: registrantBuilder(
        mochaFunction.only as RelatedMochaFunction<TMochaFunction>,
      ),
      skip: registrantBuilder(
        mochaFunction.skip as RelatedMochaFunction<TMochaFunction>,
      ),
    },
  );

type MochafiedRegistrant<TRegistrant> = TRegistrant & {
  only: TRegistrant;
  skip: TRegistrant;
};

type RelatedMochaFunction<T extends Mocha.SuiteFunction | Mocha.TestFunction> =
  T extends Mocha.SuiteFunction ? MochaSuiteFunction : MochaTestFunction;

// Registrant Builders
const buildRegisterAssertion = (
  parentConfig: SuiteConfig,
): MochafiedRegistrant<AssertionRegistrant> =>
  mochafyRegistrant<Mocha.TestFunction, AssertionRegistrant>(
    mochaIt,
    (mochaFunction) =>
      (assertionDescription: string, onAssert: AssertionCallback) => {
        parentConfig.add(
          new AssertionConfig(mochaFunction, assertionDescription, onAssert),
        );
      },
  );

const buildRegisterChainableAssertion = <TArranged, TResult>(
  parentConfig: SuiteConfig,
  getArranged: () => TArranged,
  getResult: () => TResult,
): MochafiedRegistrant<ChainableAssertionRegistrant<TArranged, TResult>> => {
  const registerChainableAssertion: MochafiedRegistrant<
    ChainableAssertionRegistrant<TArranged, TResult>
  > = mochafyRegistrant<
    Mocha.TestFunction,
    ChainableAssertionRegistrant<TArranged, TResult>
  >(
    mochaIt,
    (mochaFunction) =>
      (
        assertionDescription: string,
        onAssert: ChainableAssertionCallback<TArranged, TResult>,
      ) => {
        parentConfig.add(
          new AssertionConfig(mochaFunction, assertionDescription, () =>
            onAssert(getArranged(), getResult()),
          ),
        );

        return {
          assert: registerChainableAssertion,
        };
      },
  );

  return registerChainableAssertion;
};

const buildActRegistrant =
  <TArranged>(
    parentConfig: SuiteConfig,
    getArranged: () => TArranged,
  ): ActRegistrant<TArranged> =>
  <TResult>(
    onAct: ActCallback<TArranged, TResult>,
  ): ActionedScenarioBuilder<TArranged, TResult> => {
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
    };
  };

const buildRegisterScenario = (
  parentConfig: SuiteConfig,
): MochafiedRegistrant<ScenarioRegistrant> =>
  mochafyRegistrant(
    mochaDescribe,
    (mochaFunction) =>
      (scenarioDescription): ScenarioBuilder => {
        const config = new SuiteConfig(mochaFunction, scenarioDescription);
        parentConfig.add(config);

        return {
          arrange: buildArrangeRegistrant(config),
          annihilate: buildAnnihilateRegistrant(config, noop),
          act: buildActRegistrant<void>(config, noop),
        };
      },
  );

const buildRegisterUnitSuite = (
  parentConfig: SuiteConfig,
): MochafiedRegistrant<UnitSuiteRegistrant> =>
  mochafyRegistrant(
    mochaDescribe,
    (mochaFunction) => (unitDescription, onUnitSuite) => {
      const config = new SuiteConfig(mochaFunction, unitDescription);
      parentConfig.add(config);

      const unitSuite: UnitSuite = {
        testScenario: buildRegisterScenario(config),
        assert: buildRegisterAssertion(config),
      };
      onUnitSuite(unitSuite);
    },
  );

const buildRegisterIntegrationSuite = (
  parentConfig: SuiteConfig,
): MochafiedRegistrant<IntegrationSuiteRegistrant> =>
  mochafyRegistrant(
    mochaDescribe,
    (mochaFunction) => (integrationDescription, onIntegrationSuite) => {
      const config = new SuiteConfig(mochaFunction, integrationDescription);
      parentConfig.add(config);

      const integrationSuite: IntegrationSuite = {
        testScenario: buildRegisterScenario(config),
      };
      onIntegrationSuite(integrationSuite);
    },
  );

const buildExportSuite = (parentConfig: SuiteConfig): ExportSuite => ({
  testIntegration: buildRegisterIntegrationSuite(parentConfig),
  testUnit: buildRegisterUnitSuite(parentConfig),
  testScenario: buildRegisterScenario(parentConfig),
  assert: buildRegisterAssertion(parentConfig),
});

const buildRegisterExportSuite = (
  parentConfig: SuiteConfig,
): MochafiedRegistrant<ExportSuiteRegistrant> =>
  mochafyRegistrant(
    mochaDescribe,
    (mochaFunction) => (exportDescription, onExportSuite) => {
      const config = new SuiteConfig(mochaFunction, exportDescription);
      parentConfig.add(config);
      onExportSuite(buildExportSuite(config));
    },
  );

const registerModuleSuite: MochafiedRegistrant<ModuleSuiteRegistrant> =
  mochafyRegistrant(
    mochaDescribe,
    (mochaFunction) => (relativeModulePath, onModuleSuite) => {
      const config = new SuiteConfig(mochaFunction, relativeModulePath);
      const moduleSuite: ModuleSuite = {
        testExport: buildRegisterExportSuite(config),
      };

      onModuleSuite(moduleSuite);
      config.apply();
    },
  );

const registerSingletonModuleSuite: MochafiedRegistrant<SingletonModuleSuiteRegistrant> =
  mochafyRegistrant(
    mochaDescribe,
    (mochaFunction) => (relativeModulePath, onSingletonModuleSuite) => {
      const config = new SuiteConfig(mochaFunction, relativeModulePath);
      onSingletonModuleSuite(buildExportSuite(config));
      config.apply();
    },
  );

export const testModule = registerModuleSuite;
export const testSingletonModule = registerSingletonModuleSuite;
