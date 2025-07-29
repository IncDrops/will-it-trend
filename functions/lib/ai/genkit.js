"use strict";
// functions/src/genkit.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiProVision = exports.geminiFlash = exports.geminiPro = exports.ai = void 0;
const genkit_1 = require("genkit");
// Import specific models from the Google AI plugin for direct use in flows
const googleai_1 = require("@genkit-ai/googleai");
Object.defineProperty(exports, "geminiPro", { enumerable: true, get: function () { return googleai_1.geminiPro; } });
Object.defineProperty(exports, "geminiFlash", { enumerable: true, get: function () { return googleai_1.geminiFlash; } });
Object.defineProperty(exports, "geminiProVision", { enumerable: true, get: function () { return googleai_1.geminiProVision; } });
exports.ai = (0, genkit_1.configureGenkit)({
    plugins: [
        (0, googleai_1.googleAI)({
            // Set logLevel here to get debug logs from the Google AI interactions
            logLevel: 'debug',
        }),
    ],
    // IMPORTANT: Do NOT set 'model: "googleai/gemini-2.0-flash"' here.
    // The 'model' property at this level expects a model *object* (e.g., geminiFlash),
    // not a string identifier. It's best to specify the model directly in your flows
    // when calling ai.generate, or use defaultModel if you only use one.
    // Example if you wanted a global default model:
    // defaultModel: geminiFlash,
});
//# sourceMappingURL=genkit.js.map