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
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
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
const prompt = genkit_1.ai.definePrompt({
    name: 'trendForecastPrompt',
    input: { schema: TrendForecastInputSchema },
    output: { schema: TrendForecastOutputSchema },
    prompt: `You are an AI trend forecaster. Given an idea, hashtag, or product and a time horizon,
you will forecast its trending potential based on current market trends, social buzz, and competitive analysis.

Input: {{{input}}}
Time Horizon: {{{timeHorizon}}}

Consider the following:
- Current market trends
- Social media buzz and engagement
- Competitive landscape
- Potential for virality
- Novelty and uniqueness

Output a trend score (0-100) and a rationale for the score.`,
});
const trendForecastFlow = genkit_1.ai.defineFlow({
    name: 'trendForecastFlow',
    inputSchema: TrendForecastInputSchema,
    outputSchema: TrendForecastOutputSchema,
}, async (input) => {
    try {
        const { output } = await prompt(input);
        if (!output) {
            throw new Error('AI model did not return a valid output.');
        }
        return output;
    }
    catch (error) {
        console.error('Error in trendForecastFlow:', error);
        // Re-throw a more user-friendly error to be caught by the action handler
        throw new Error(`Failed to get trend forecast from AI: ${error.message}`);
    }
});
//# sourceMappingURL=trend-forecasting.js.map