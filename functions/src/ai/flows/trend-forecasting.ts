// functions/src/ai/flows/trend-forecasting.ts

/**
 * @fileOverview An AI agent for forecasting the trending potential of ideas, hashtags, or products.
 *
 * - trendForecast - A function that accepts an idea, hashtag, or product and a time horizon, then uses AI to forecast its trending potential.
 * - TrendForecastInput - The input type for the trendForecast function.
 * - TrendForecastOutput - The return type for the trendForecast function.
 */

import { ai } from '../../genkit'; // Correct relative path to genkit.ts
import { z } from 'genkit';
import { geminiFlash } from '@genkit-ai/googleai'; // Import the specific model

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

// Removed the separate 'prompt' constant and integrated prompt definition directly into the flow
const trendForecastFlow = ai.defineFlow(
  {
    name: 'trendForecastFlow',
    inputSchema: TrendForecastInputSchema,
    outputSchema: TrendForecastOutputSchema,
  },
  async input => {
    let rawAiResponseText: string | undefined; // To store the raw text for debugging

    try {
      const response = await ai.generate({
        model: geminiFlash, // Explicitly specify the model here
        prompt: `You are an AI trend forecaster. Your ONLY output will be a JSON object.
          Given an idea, hashtag, or product and a time horizon,
          you will forecast its trending potential based on current market trends, social buzz, and competitive analysis.

          Input: ${input.input}
          Time Horizon: ${input.timeHorizon}

          Consider the following:
          - Current market trends
          - Social media buzz and engagement
          - Competitive landscape
          - Potential for virality
          - Novelty and uniqueness

          Output a trend score (0-100) and a rationale for the score.
          The output MUST be valid JSON with exactly two fields: "trendScore" (number) and "rationale" (string).
          DO NOT include any conversational text, markdown code blocks (like \`\`\`json\`\`\`), or any other characters before or after the JSON object.
          `,
        output: {
          schema: TrendForecastOutputSchema, // This tells Genkit to parse the output into this schema
        },
      });

      rawAiResponseText = response.text(); // Capture the raw text before checking output
      console.log('--- Raw AI Response Text (from trendForecastFlow) ---');
      console.log(rawAiResponseText);
      console.log('----------------------------------------------------');

      const { output } = response;

      if (!output) {
        // If output is null, it means Genkit's internal schema parser failed.
        console.error('Genkit failed to parse AI output to schema. Raw text was:', rawAiResponseText);
        throw new Error('The AI model did not return a valid response that could be parsed into the expected JSON schema.');
      }
      return output;

    } catch (error: any) {
      console.error('Error during AI generation or parsing in trendForecastFlow:', error);
      // Re-throw an error that includes the raw AI response for outer logging
      throw new Error(`AI Trend Forecasting failed: ${error.message || 'Unknown AI error'}. Raw AI output (if available): "${rawAiResponseText}".`);
    }
  }
);