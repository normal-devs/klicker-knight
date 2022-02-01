"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noMemberOnly_1 = require("./semantic-mocha/noMemberOnly");
const noMemberSkip_1 = require("./semantic-mocha/noMemberSkip");
// eslint-disable-next-line import/no-default-export
exports.default = {
    [noMemberOnly_1.semanticMochaNoMemberOnly.name]: noMemberOnly_1.semanticMochaNoMemberOnly.module,
    [noMemberSkip_1.semanticMochaNoMemberSkip.name]: noMemberSkip_1.semanticMochaNoMemberSkip.module,
};
