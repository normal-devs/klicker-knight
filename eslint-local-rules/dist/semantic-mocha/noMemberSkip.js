"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticMochaNoMemberSkip = void 0;
const utils_1 = require("../utils");
exports.semanticMochaNoMemberSkip = (0, utils_1.createCustomRule)('semantic-mocha/no-member-skip', {
    meta: {
        docs: {
            url: 'https://github.com/normal-devs/klicker-knight/blob/main/eslint-local-rules/docs/semantic-mocha/no-member-skip.md',
        },
        messages: {
            noSkip: 'Unexpected .skip call.',
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
                if (callee.property.name === 'skip') {
                    context.report({
                        node: callee.property,
                        messageId: 'noSkip',
                    });
                }
            },
        };
    },
});
