// functions/src/genkit.ts

import { configureGenkit } from 'genkit';
// Import specific models from the Google AI plugin for direct use in flows
import { googleAI, geminiPro, geminiFlash, geminiProVision } from '@genkit-ai/googleai';

export const ai = configureGenkit({
  plugins: [
    googleAI({
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

// Export specific model objects so they can be imported and used in other flow files
export { geminiPro, geminiFlash, geminiProVision };