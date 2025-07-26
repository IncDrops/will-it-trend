// src/ai/flows/generate-rationale.ts
'use server';
/**
 * @fileOverview AI agent that generates a rationale for a given trend and score.
 *
 * - generateRationale - A function that generates a rationale for a trend score.
 * - GenerateRationaleInput - The input type for the generateRationale function.
 * - GenerateRationaleOutput - The return type for the generateRationale function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRationaleInputSchema = z.object({
  trend: z.string().describe('The trend to generate a rationale for.'),
  score: z.number().describe('The trend score to explain.'),
});
export type GenerateRationaleInput = z.infer<typeof GenerateRationaleInputSchema>;

const GenerateRationaleOutputSchema = z.object({
  rationale: z.string().describe('The generated rationale for the trend score.'),
});
export type GenerateRationaleOutput = z.infer<typeof GenerateRationaleOutputSchema>;

export async function generateRationale(input: GenerateRationaleInput): Promise<GenerateRationaleOutput> {
  return generateRationaleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRationalePrompt',
  input: {schema: GenerateRationaleInputSchema},
  output: {schema: GenerateRationaleOutputSchema},
  prompt: `You are an AI trend forecaster. Explain the following trend's score.

Trend: {{{trend}}}
Score: {{{score}}}

Rationale:`,
});

const generateRationaleFlow = ai.defineFlow(
  {
    name: 'generateRationaleFlow',
    inputSchema: GenerateRationaleInputSchema,
    outputSchema: GenerateRationaleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
