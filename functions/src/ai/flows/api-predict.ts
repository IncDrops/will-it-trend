
'use server';
/**
 * @fileOverview An AI agent for predicting viral potential for the API.
 *
 * - apiPredict - A function that predicts trend potential.
 * - ApiPredictInput - The input type for the apiPredict function.
 * - ApiPredictOutput - The return type for the apiPredict function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const ApiPredictInputSchema = z.object({
  topic: z.string().describe('The topic or trend to analyze.'),
});
export type ApiPredictInput = z.infer<typeof ApiPredictInputSchema>;

const ApiPredictOutputSchema = z.object({
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0-100 representing the viral potential.'),
  keyDrivers: z
    .array(z.string())
    .describe('A list of key factors driving the prediction.'),
  recommendedAction: z
    .string()
    .describe('A suggested action to capitalize on the trend.'),
});
export type ApiPredictOutput = z.infer<typeof ApiPredictOutputSchema>;

export async function apiPredict(
  input: ApiPredictInput
): Promise<ApiPredictOutput> {
  return apiPredictFlow(input);
}

const prompt = ai.definePrompt({
  name: 'apiPredictPrompt',
  input: {schema: ApiPredictInputSchema},
  output: {schema: ApiPredictOutputSchema},
  prompt: `Predict the viral potential of "[{{topic}}]" over the next 48 hours. Consider historical trends, engagement velocity, and platform algorithms. Respond in JSON format.`,
});

const apiPredictFlow = ai.defineFlow(
  {
    name: 'apiPredictFlow',
    inputSchema: ApiPredictInputSchema,
    outputSchema: ApiPredictOutputSchema,
  },
  async (input: ApiPredictInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
