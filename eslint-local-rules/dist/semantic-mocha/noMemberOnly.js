"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticMochaNoMemberOnly = void 0;
const utils_1 = require("../utils");
exports.semanticMochaNoMemberOnly = (0, utils_1.createCustomRule)('semantic-mocha/no-member-only', {
    meta: {
        docs: {
            url: 'https://github.com/normal-devs/klicker-knight/blob/main/eslint-local-rules/docs/semantic-mocha/no-member-only.md',
        },
        messages: {
            noOnly: 'Unexpected .only call.',
        },
    },
    create(context) {
        return {
            CallExpression(node) {
                const { callee } = node;
                if (callee.type !== 'MemberExpression') {
                    return;
                }
                if (callee.property.type !== 'Identifier') {
                    return;
                }
                if (callee.property.name === 'only') {
                    context.report({
                        node: callee.property,
                        messageId: 'noOnly',
                    });
                }
            },
        };
    },
});
