import { Rule } from 'eslint';
declare type CustomRule<T> = {
    name: T;
    module: Rule.RuleModule;
};
export declare const createCustomRule: <T extends string>(name: T, module: Rule.RuleModule) => CustomRule<T>;
export {};
