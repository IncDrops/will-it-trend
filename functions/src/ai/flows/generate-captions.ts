
'use server';
/**
 * @fileOverview An AI agent for generating social media captions.
 *
 * - generateCaptions - A function that generates captions for a given topic and tone.
 * - GenerateCaptionsInput - The input type for the generateCaptions function.
 * - GenerateCaptionsOutput - The return type for the generateCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionsInputSchema = z.object({
  topic: z.string().describe('The topic or idea for the captions.'),
  tone: z
    .string()
    .describe(
      "The desired tone for the captions (e.g., 'Professional', 'Casual', 'Witty')."
    ),
});
export type GenerateCaptionsInput = z.infer<
  typeof GenerateCaptionsInputSchema
>;

const GenerateCaptionsOutputSchema = z.object({
  captions: z.array(z.string()).describe('A list of 5 generated captions.'),
});
export type GenerateCaptionsOutput = z.infer<
  typeof GenerateCaptionsOutputSchema
>;

export async function generateCaptions(
  input: GenerateCaptionsInput
): Promise<GenerateCaptionsOutput> {
  return generateCaptionsFlow(input);
}

const generateCaptionsFlow = ai.defineFlow(
  {
    name: 'generateCaptionsFlow',
    inputSchema: GenerateCaptionsInputSchema,
    outputSchema: GenerateCaptionsOutputSchema,
  },
  async (input) => {
    const {output} = await ai.generate({
      prompt: `You are a social media copywriter. Generate 5 engaging captions for the given topic and tone.

      Topic: ${input.topic}
      Tone: ${input.tone}
      
      Captions:`,
      output: {
        schema: GenerateCaptionsOutputSchema,
      },
    });

    return output!;
  }
);
