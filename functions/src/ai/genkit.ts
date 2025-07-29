import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { geminiPro, geminiProFlash, geminiProVision } from '@genkit-ai/googleai'; // Import specific models

export const ai = genkit({
  plugins: [
    googleAI(), // This registers all Google AI models (like geminiPro, geminiProFlash, etc.)
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

// You can also export specific models for direct use in your flows, e.g.:
export { geminiProFlash }; // If you want to use it directly in defineFlow