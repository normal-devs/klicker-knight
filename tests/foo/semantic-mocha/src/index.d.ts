declare type AssertionRegistrant = (assertionDescription: string, onAssert: AssertionCallback) => void;
declare type AssertionCallback = () => void;
declare type ChainableAssertionRegistrant<TArranged, TResult> = (assertionDescription: string, onAssert: ChainableAssertionCallback<TArranged, TResult>) => AssertedScenarioBuilder<TArranged, TResult>;
declare type ChainableAssertionCallback<TArranged, TResult> = (arranged: TArranged, result: TResult) => void;
declare type AssertedScenarioBuilder<TArranged, TResult> = ScenarioAssertBuilder<TArranged, TResult>;
declare type ActRegistrant<TArranged> = <TResult>(onAct: ActCallback<TArranged, TResult>) => ActionedScenarioBuilder<TArranged, TResult>;
declare type ActCallback<TArranged, TResult> = (arranged: TArranged) => TResult;
declare type ActionedScenarioBuilder<TArranged, TResult> = ScenarioAssertBuilder<TArranged, TResult>;
declare type AnnihilateRegistrant<TArranged> = (onAnnihilate: AnnihilateCallback<TArranged>) => AnnihilatedScenarioBuilder<TArranged>;
declare type AnnihilateCallback<TArranged> = (arranged: TArranged) => void;
declare type AnnihilatedScenarioBuilder<TArranged> = ScenarioActBuilder<TArranged>;
declare type ArrangeRegistrant = <TArranged>(onArrange: ArrangeCallback<TArranged>) => ArrangedScenarioBuilder<TArranged>;
declare type ArrangeCallback<TArranged> = () => TArranged;
declare type ArrangedScenarioBuilder<TArranged> = ScenarioAnnihilateBuilder<TArranged> & ScenarioActBuilder<TArranged>;
declare type ScenarioRegistrant = (scenarioDescription: string) => ScenarioBuilder;
declare type ScenarioBuilder = ScenarioArrangeBuilder & ScenarioAnnihilateBuilder<void> & ScenarioActBuilder<void>;
declare type ScenarioArrangeBuilder = {
    arrange: ArrangeRegistrant;
};
declare type ScenarioActBuilder<TArranged> = {
    act: ActRegistrant<TArranged>;
};
declare type ScenarioAnnihilateBuilder<TArranged> = {
    annihilate: AnnihilateRegistrant<TArranged>;
};
declare type ScenarioAssertBuilder<TArranged, TResult> = {
    assert: MochafiedRegistrant<ChainableAssertionRegistrant<TArranged, TResult>>;
};
declare type ExportParentSuite = {
    testExport: MochafiedRegistrant<ExportSuiteRegistrant>;
};
declare type IntegrationParentSuite = {
    testIntegration: MochafiedRegistrant<IntegrationSuiteRegistrant>;
};
declare type UnitParentSuite = {
    testUnit: MochafiedRegistrant<UnitSuiteRegistrant>;
};
declare type AssertableSuite = {
    assert: MochafiedRegistrant<AssertionRegistrant>;
};
declare type ScenarioableSuite = {
    testScenario: MochafiedRegistrant<ScenarioRegistrant>;
};
declare type UnitSuiteRegistrant = (unitDescription: string, onUnitSuite: UnitSuiteRegistrantCallback) => void;
declare type UnitSuiteRegistrantCallback = (unitSuite: UnitSuite) => void;
declare type UnitSuite = AssertableSuite & ScenarioableSuite;
declare type IntegrationSuiteRegistrant = (integrationDescription: string, onIntegrationSuite: IntegrationSuiteRegistrantCallback) => void;
declare type IntegrationSuiteRegistrantCallback = (integrationSuite: IntegrationSuite) => void;
declare type IntegrationSuite = ScenarioableSuite;
declare type ExportSuiteRegistrant = (moduleExportDescription: string, onExportSuite: ExportSuiteRegistrantCallback) => void;
declare type ExportSuiteRegistrantCallback = (exportSuite: ExportSuite) => void;
declare type ExportSuite = IntegrationParentSuite & UnitParentSuite & AssertableSuite & ScenarioableSuite;
declare type ModuleSuiteRegistrant = (relativeModulePath: string, onModuleSuite: ModuleSuiteRegistrantCallback) => void;
declare type ModuleSuiteRegistrantCallback = (moduleSuite: ModuleSuite) => void;
declare type ModuleSuite = ExportParentSuite;
declare type SingletonModuleSuiteRegistrant = (relativeModulePath: string, onSingletonModuleSuite: SingletonModuleSuiteRegistrantCallback) => void;
declare type SingletonModuleSuiteRegistrantCallback = (exportSuite: ExportSuite) => void;
declare type MochafiedRegistrant<TRegistrant> = TRegistrant & {
    only: TRegistrant;
    skip: TRegistrant;
};
export declare const testModule: MochafiedRegistrant<ModuleSuiteRegistrant>;
export declare const testSingletonModule: MochafiedRegistrant<SingletonModuleSuiteRegistrant>;
export declare const testIntegration: MochafiedRegistrant<IntegrationSuiteRegistrant>;
export {};
