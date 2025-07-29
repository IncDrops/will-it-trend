
'use server';

/**
 * @fileOverview An AI agent for forecasting the trending potential of ideas, hashtags, or products.
 *
 * - trendForecast - A function that accepts an idea, hashtag, or product and a time horizon, then uses AI to forecast its trending potential.
 * - TrendForecastInput - The input type for the trendForecast function.
 * - TrendForecastOutput - The return type for the trendForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {geminiFlash} from '@genkit-ai/googleai'; 

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

const trendForecastFlow = ai.defineFlow(
  {
    name: 'trendForecastFlow',
    inputSchema: TrendForecastInputSchema,
    outputSchema: TrendForecastOutputSchema,
  },
  async (input) => {
    let rawAiResponseText: string | undefined;

    try {
      const response = await ai.generate({
        model: geminiFlash,
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
          DO NOT include any conversational text or markdown code blocks (like \`\`\`json).
          `,
        output: {
          schema: TrendForecastOutputSchema,
        },
      });

      rawAiResponseText = response.text;
      console.log('--- Raw AI Response Text (for debugging) ---');
      console.log(rawAiResponseText);
      console.log('--------------------------------------------');

      const {output} = response;

      if (!output) {
        console.error(
          'Genkit failed to parse AI output to schema. Raw text was:',
          rawAiResponseText
        );
        throw new Error(
          'The AI model did not return a valid response that could be parsed into the expected JSON schema.'
        );
      }
      return output;
    } catch (error: any) {
      console.error(
        'Error during AI generation or parsing in trendForecastFlow:',
        error
      );
      throw new Error(
        `AI Trend Forecasting failed: ${
          error.message || 'Unknown AI error'
        }. Raw AI output (if available): "${rawAiResponseText}".`
      );
    }
  }
);
