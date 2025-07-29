// src/ai/flows/trend-forecasting.ts
'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendForecast = trendForecast;
/**
 * @fileOverview An AI agent for forecasting the trending potential of ideas, hashtags, or products.
 *
 * - trendForecast - A function that accepts an idea, hashtag, or product and a time horizon, then uses AI to forecast its trending potential.
 * - TrendForecastInput - The input type for the trendForecast function.
 * - TrendForecastOutput - The return type for the trendForecast function.
 */
// IMPORTANT: Ensure this path is correct and your genkit.ts exports 'ai' correctly
const genkit_1 = require("../genkit");
const genkit_2 = require("genkit");
// Import the specific model you want to use
const googleai_1 = require("@genkit-ai/googleai"); // <--- ADD THIS IMPORT
const TrendForecastInputSchema = genkit_2.z.object({
    input: genkit_2.z.string().describe('An idea, hashtag, or product to forecast.'),
    timeHorizon: genkit_2.z.string().describe('The time horizon for the forecast (e.g., 5 minutes, 31 days).'),
});
const TrendForecastOutputSchema = genkit_2.z.object({
    trendScore: genkit_2.z.number().describe('A score representing the trending potential (0-100).'),
    rationale: genkit_2.z.string().describe('The rationale behind the trend score, based on market trends, social buzz, and competitive analysis.'),
});
async function trendForecast(input) {
    return trendForecastFlow(input);
}
const trendForecastFlow = genkit_1.ai.defineFlow({
    name: 'trendForecastFlow',
    inputSchema: TrendForecastInputSchema,
    outputSchema: TrendForecastOutputSchema,
}, async (input) => {
    // You can define the prompt directly within the flow using ai.generate,
    // or pass the model to a defined prompt like this:
    const { output } = await genkit_1.ai.generate({
        model: googleai_1.geminiProFlash, // <-- Specify the model instance here!
        prompt: `You are an AI trend forecaster. Given an idea, hashtag, or product and a time horizon,
        you will forecast its trending potential based on current market trends, social buzz, and competitive analysis.

        Input: ${input.input}
        Time Horizon: ${input.timeHorizon}

        Consider the following:
        - Current market trends
        - Social media buzz and engagement
        - Competitive landscape
        - Potential for virality
        - Novelty and uniqueness

        Output a trend score (0-100) and a rationale for the score. The output MUST be in JSON format matching the schema: {"trendScore": number, "rationale": string}.
        `,
        output: {
            schema: TrendForecastOutputSchema, // This tells Genkit to parse the output into this schema
        },
    });
    if (!output) {
        throw new Error('The AI model did not return a valid response or could not be parsed into the expected schema.');
    }
    return output;
});
//# sourceMappingURL=trend-forecasting.js.map