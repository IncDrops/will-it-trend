// src/ai/flows/trend-forecasting.ts
'use server';

/**
 * @fileOverview An AI agent for forecasting the trending potential of ideas, hashtags, or products.
 *
 * - trendForecast - A function that accepts an idea, hashtag, or product and a time horizon, then uses AI to forecast its trending potential.
 * - TrendForecastInput - The input type for the trendForecast function.
 * - TrendForecastOutput - The return type for the trendForecast function.
 */

// IMPORTANT: Ensure this path is correct and your genkit.ts exports 'ai' correctly
import { ai } from '../genkit';
import { z } from 'genkit';
// Import the specific model you want to use
import { geminiProFlash } from '@genkit-ai/googleai'; // <--- ADD THIS IMPORT

const TrendForecastInputSchema = z.object({
  input: z.string().describe('An idea, hashtag, or product to forecast.'),
  timeHorizon: z.string().describe('The time horizon for the forecast (e.g., 5 minutes, 31 days).'),
});
export type TrendForecastInput = z.infer<typeof TrendForecastInputSchema>;

const TrendForecastOutputSchema = z.object({
  trendScore: z.number().describe('A score representing the trending potential (0-100).'),
  rationale: z.string().describe('The rationale behind the trend score, based on market trends, social buzz, and competitive analysis.'),
});
export type TrendForecastOutput = z.infer<typeof TrendForecastOutputSchema>;

export async function trendForecast(input: TrendForecastInput): Promise<TrendForecastOutput> {
  return trendForecastFlow(input);
}

const trendForecastFlow = ai.defineFlow(
  {
    name: 'trendForecastFlow',
    inputSchema: TrendForecastInputSchema,
    outputSchema: TrendForecastOutputSchema,
  },
  async input => {
    // You can define the prompt directly within the flow using ai.generate,
    // or pass the model to a defined prompt like this:
    const { output } = await ai.generate({ // Use ai.generate directly for explicit model control
      model: geminiProFlash, // <-- Specify the model instance here!
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
  }
);