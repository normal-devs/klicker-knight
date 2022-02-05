"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testIntegration = exports.testSingletonModule = exports.testModule = void 0;
const mochaDescribe = describe;
const mochaBefore = before;
const mochaAfter = after;
const mochaIt = it;
const noop = () => { };
class MochaConfig {
    constructor(mochaFunction, description) {
        this.mochaFunction = mochaFunction;
        this.description = description;
    }
}
class AssertionConfig extends MochaConfig {
    constructor(mochaFunction, description, onAssert) {
        super(mochaFunction, description);
        this.onAssert = onAssert;
    }
    apply() {
        this.mochaFunction(this.description, this.onAssert);
    }
}
class HookConfig extends MochaConfig {
    constructor(mochaFunction, description, onHook) {
        super(mochaFunction, description);
        this.onHook = onHook;
    }
    apply() {
        this.mochaFunction(this.description, () => this.onHook());
    }
}
class SuiteConfig extends MochaConfig {
    constructor(mochaFunction, description) {
        super(mochaFunction, description);
        this.description = description;
        this.nested = [];
    }
    add(config) {
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
const mochafyRegistrant = (mochaFunction, registrantBuilder) => Object.assign(registrantBuilder(mochaFunction), {
    only: registrantBuilder(mochaFunction.only),
    skip: registrantBuilder(mochaFunction.skip),
});
// Registrant Builders
const buildRegisterAssertion = (parentConfig) => mochafyRegistrant(mochaIt, (mochaFunction) => (assertionDescription, onAssert) => {
    parentConfig.add(new AssertionConfig(mochaFunction, assertionDescription, onAssert));
});
const buildRegisterChainableAssertion = (parentConfig, getArranged, getResult) => {
    const registerChainableAssertion = mochafyRegistrant(mochaIt, (mochaFunction) => (assertionDescription, onAssert) => {
        parentConfig.add(new AssertionConfig(mochaFunction, assertionDescription, () => onAssert(getArranged(), getResult())));
        return {
            assert: registerChainableAssertion,
        };
    });
    return registerChainableAssertion;
};
const buildActRegistrant = (parentConfig, getArranged) => (onAct) => {
    let result;
    const getResult = () => result;
    const hookWrapper = () => {
        result = onAct(getArranged());
    };
    parentConfig.add(new HookConfig(mochaBefore, '"act"', hookWrapper));
    return {
        assert: buildRegisterChainableAssertion(parentConfig, getArranged, getResult),
    };
};
const buildAnnihilateRegistrant = (parentConfig, getArranged) => (onAnnihilate) => {
    const hookWrapper = () => onAnnihilate(getArranged());
    parentConfig.add(new HookConfig(mochaAfter, 'annihilate', hookWrapper));
    return {
        act: buildActRegistrant(parentConfig, getArranged),
    };
};
const buildArrangeRegistrant = (parentConfig) => (onArrange) => {
    let arranged;
    const getArranged = () => arranged;
    const hookWrapper = () => {
        arranged = onArrange();
    };
    parentConfig.add(new HookConfig(mochaBefore, 'arrange', hookWrapper));
    return {
        annihilate: buildAnnihilateRegistrant(parentConfig, getArranged),
        act: buildActRegistrant(parentConfig, getArranged),
    };
};
const buildRegisterScenario = (parentConfig) => mochafyRegistrant(mochaDescribe, (mochaFunction) => (scenarioDescription) => {
    const config = new SuiteConfig(mochaFunction, scenarioDescription);
    parentConfig.add(config);
    return {
        arrange: buildArrangeRegistrant(config),
        annihilate: buildAnnihilateRegistrant(config, noop),
        act: buildActRegistrant(config, noop),
    };
});
const buildRegisterUnitSuite = (parentConfig) => mochafyRegistrant(mochaDescribe, (mochaFunction) => (unitDescription, onUnitSuite) => {
    const config = new SuiteConfig(mochaFunction, unitDescription);
    parentConfig.add(config);
    const unitSuite = {
        testScenario: buildRegisterScenario(config),
        assert: buildRegisterAssertion(config),
    };
    onUnitSuite(unitSuite);
});
const buildRegisterIntegrationSuite = (parentConfig) => mochafyRegistrant(mochaDescribe, (mochaFunction) => (integrationDescription, onIntegrationSuite) => {
    const config = new SuiteConfig(mochaFunction, integrationDescription);
    if (parentConfig) {
        parentConfig.add(config);
    }
    const integrationSuite = {
        testScenario: buildRegisterScenario(config),
    };
    onIntegrationSuite(integrationSuite);
    if (!parentConfig) {
        config.apply();
    }
});
const buildExportSuite = (parentConfig) => ({
    testIntegration: buildRegisterIntegrationSuite(parentConfig),
    testUnit: buildRegisterUnitSuite(parentConfig),
    testScenario: buildRegisterScenario(parentConfig),
    assert: buildRegisterAssertion(parentConfig),
});
const buildRegisterExportSuite = (parentConfig) => mochafyRegistrant(mochaDescribe, (mochaFunction) => (exportDescription, onExportSuite) => {
    const config = new SuiteConfig(mochaFunction, exportDescription);
    parentConfig.add(config);
    onExportSuite(buildExportSuite(config));
});
const registerModuleSuite = mochafyRegistrant(mochaDescribe, (mochaFunction) => (relativeModulePath, onModuleSuite) => {
    const config = new SuiteConfig(mochaFunction, relativeModulePath);
    const moduleSuite = {
        testExport: buildRegisterExportSuite(config),
    };
    onModuleSuite(moduleSuite);
    config.apply();
});
const registerSingletonModuleSuite = mochafyRegistrant(mochaDescribe, (mochaFunction) => (relativeModulePath, onSingletonModuleSuite) => {
    const config = new SuiteConfig(mochaFunction, relativeModulePath);
    onSingletonModuleSuite(buildExportSuite(config));
    config.apply();
});
const registerIntegrationSuite = buildRegisterIntegrationSuite(null);
exports.testModule = registerModuleSuite;
exports.testSingletonModule = registerSingletonModuleSuite;
exports.testIntegration = registerIntegrationSuite;
