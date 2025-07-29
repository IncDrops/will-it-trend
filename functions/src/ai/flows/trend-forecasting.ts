'use server';

/**
 * @fileOverview An AI agent for forecasting the trending potential of ideas, hashtags, or products.
 *
 * - trendForecast - A function that accepts an idea, hashtag, or product and a time horizon, then uses AI to forecast its trending potential.
 * - TrendForecastInput - The input type for the trendForecast function.
 * - TrendForecastOutput - The return type for the trendForecast function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const TrendForecastInputSchema = z.object({
  input: z.string().describe('An idea, hashtag, or product to forecast.'),
  timeHorizon: z
    .string()
    .describe('The time horizon for the forecast (e.g., 5 minutes, 31 days).'),
});
export type TrendForecastInput = z.infer<typeof TrendForecastInputSchema>;

const TrendForecastOutputSchema = z.object({
  trendScore: z
    .number()
    .describe('A score representing the trending potential (0-100).'),
  rationale: z
    .string()
    .describe(
      'The rationale behind the trend score, based on market trends, social buzz, and competitive analysis.'
    ),
});
export type TrendForecastOutput = z.infer<typeof TrendForecastOutputSchema>;

export async function trendForecast(
  input: TrendForecastInput
): Promise<TrendForecastOutput> {
  return trendForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trendForecastPrompt',
  input: {schema: TrendForecastInputSchema},
  output: {schema: TrendForecastOutputSchema},
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

const trendForecastFlow = ai.defineFlow(
  {
    name: 'trendForecastFlow',
    inputSchema: TrendForecastInputSchema,
    outputSchema: TrendForecastOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI model did not return a valid output.');
      }
      return output;
    } catch (error: any) {
      console.error('Error in trendForecastFlow:', error);
      // Re-throw a more user-friendly error to be caught by the action handler
      throw new Error(`Failed to get trend forecast from AI: ${error.message}`);
    }
  }
);
