'use server';
/**
 * @fileOverview An AI agent for finding relevant hashtags.
 *
 * - findHashtags - A function that finds trending and niche hashtags for a given topic.
 * - FindHashtagsInput - The input type for the findHashtags function.
 * - FindHashtagsOutput - The return type for the findHashtags function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const FindHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic or keyword to find hashtags for.'),
});
export type FindHashtagsInput = z.infer<typeof FindHashtagsInputSchema>;

const FindHashtagsOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe(
      'A list of 10-15 relevant hashtags, including a mix of popular and niche ones.'
    ),
});
export type FindHashtagsOutput = z.infer<typeof FindHashtagsOutputSchema>;

export async function findHashtags(
  input: FindHashtagsInput
): Promise<FindHashtagsOutput> {
  return findHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findHashtagsPrompt',
  input: {schema: FindHashtagsInputSchema},
  output: {schema: FindHashtagsOutputSchema},
  prompt: `You are a social media expert. Generate a list of 10-15 optimal hashtags for the following topic.
The list should include a mix of high-traffic, niche, and community-specific hashtags. Do not include the '#' symbol.

Topic: {{{topic}}}

Hashtags:`,
});

const findHashtagsFlow = ai.defineFlow(
  {
    name: 'findHashtagsFlow',
    inputSchema: FindHashtagsInputSchema,
    outputSchema: FindHashtagsOutputSchema,
  },
  async (input: FindHashtagsInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
