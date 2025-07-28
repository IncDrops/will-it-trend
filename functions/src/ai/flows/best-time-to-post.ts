'use server';
/**
 * @fileOverview An AI agent for recommending the best time to post on social media.
 *
 * - getBestTimeToPost - A function that returns the best time to post based on industry and platform.
 * - BestTimeToPostInput - The input type for the getBestTimeToPost function.
 * - BestTimeToPostOutput - The return type for the getBestTimeToPost function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const BestTimeToPostInputSchema = z.object({
  industry: z.string().describe('The industry or topic of the content.'),
  platform: z
    .string()
    .describe('The social media platform (e.g., TikTok, Instagram).'),
});
export type BestTimeToPostInput = z.infer<typeof BestTimeToPostInputSchema>;

const BestTimeToPostOutputSchema = z.object({
  time: z
    .string()
    .describe(
      'The recommended posting time, including timezone (e.g., "9:00 AM EST").'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation for the recommendation (e.g., "Highest engagement on Tuesdays").'
    ),
});
export type BestTimeToPostOutput = z.infer<typeof BestTimeToPostOutputSchema>;

export async function getBestTimeToPost(
  input: BestTimeToPostInput
): Promise<BestTimeToPostOutput> {
  return bestTimeToPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bestTimeToPostPrompt',
  input: {schema: BestTimeToPostInputSchema},
  output: {schema: BestTimeToPostOutputSchema},
  prompt: `You are a social media expert. Based on the given industry and platform, determine the single best time to post for maximum engagement.
Provide a specific time and a concise reason.

Industry: {{{industry}}}
Platform: {{{platform}}}

Analysis: Consider peak user activity times for the platform and typical audience behavior in the specified industry.

Recommended Time: {{time}}
Reasoning: {{reasoning}}`,
});

const bestTimeToPostFlow = ai.defineFlow(
  {
    name: 'bestTimeToPostFlow',
    inputSchema: BestTimeToPostInputSchema,
    outputSchema: BestTimeToPostOutputSchema,
  },
  async (input: BestTimeToPostInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
