"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperError = void 0;
class DeveloperError extends Error {
    constructor(message) {
        super(`#blame-jfrog: ${message}`);
    }
}
exports.DeveloperError = DeveloperError;
