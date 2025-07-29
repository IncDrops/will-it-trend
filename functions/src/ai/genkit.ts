// src/genkit.ts
import { configureGenkit } from 'genkit'; // Correct import for configureGenkit
import { googleAI, geminiPro, geminiFlash, geminiVision } from '@genkit-ai/googleai'; // Import all specific models for clarity and use

export const ai = configureGenkit({
  plugins: [
    googleAI({
      // Set logLevel within the plugin's configuration options
      logLevel: 'debug', // <--- MOVED HERE
      // You can also set other Google AI specific configurations here if needed,
      // like projectId or accessToken, though usually not needed in Firebase Functions.
    }),
  ],
  // 'model' here is for setting a default model across all flows if not specified.
  // It expects a model *object*, not a string. For most cases,
  // it's better to explicitly set the model in the flow using ai.generate.
  // Example: defaultModel: geminiFlash, // If you want a global default
});

// Export specific models for direct use in other files
export { geminiPro, geminiFlash, geminiVision };