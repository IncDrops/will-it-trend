"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiProFlash = exports.ai = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const googleai_2 = require("@genkit-ai/googleai"); // Import specific models
Object.defineProperty(exports, "geminiProFlash", { enumerable: true, get: function () { return googleai_2.geminiProFlash; } });
exports.ai = (0, genkit_1.genkit)({
    plugins: [
        (0, googleai_1.googleAI)(), // This registers all Google AI models (like geminiPro, geminiProFlash, etc.)
    ],
    // You don't typically set a specific model string here.
    // Instead, you configure the plugins, and then select the model in your flows.
    // Optional: Set a default model here if you want to use it globally
    // for all calls that don't specify a model.
    // It should be an actual model object from a plugin, e.g., geminiProFlash.
    // For most cases, it's better to explicitly define the model in your flow.
    // defaultModel: geminiProFlash, // <-- If you really want a default
    // For debugging, set log level to debug
    logLevel: 'debug',
});
//# sourceMappingURL=genkit.js.map