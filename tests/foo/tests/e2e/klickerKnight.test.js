"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const child_process_1 = require("child_process");
const databaseUtil_1 = require("../../src/utils/databaseUtil");
const semanticMocha_1 = require("../testHelpers/semanticMocha");
(0, semanticMocha_1.testIntegration)('klicker-knight', ({ testScenario }) => {
    testScenario('always')
        .annihilate(() => {
        databaseUtil_1.databaseUtil.delete();
    })
        .act(() => (0, child_process_1.execSync)('npm run --silent klicker-knight').toString())
        .assert('trips on a flagstone', (arrranged, result) => {
        (0, chai_1.expect)(result).to.contain('flagstone. You fall and break your neck.');
    });
});
