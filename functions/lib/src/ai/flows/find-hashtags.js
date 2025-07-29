'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findHashtags = findHashtags;
/**
 * @fileOverview An AI agent for finding relevant hashtags.
 *
 * - findHashtags - A function that finds trending and niche hashtags for a given topic.
 * - FindHashtagsInput - The input type for the findHashtags function.
 * - FindHashtagsOutput - The return type for the findHashtags function.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const FindHashtagsInputSchema = genkit_2.z.object({
    topic: genkit_2.z.string().describe('The topic or keyword to find hashtags for.'),
});
const FindHashtagsOutputSchema = genkit_2.z.object({
    hashtags: genkit_2.z.array(genkit_2.z.string()).describe('A list of 10-15 relevant hashtags, including a mix of popular and niche ones.'),
});
async function findHashtags(input) {
    return findHashtagsFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: 'findHashtagsPrompt',
    input: { schema: FindHashtagsInputSchema },
    output: { schema: FindHashtagsOutputSchema },
    prompt: `You are a social media expert. Generate a list of 10-15 optimal hashtags for the following topic.
The list should include a mix of high-traffic, niche, and community-specific hashtags. Do not include the '#' symbol.

Topic: {{{topic}}}

Hashtags:`,
});
const findHashtagsFlow = genkit_1.ai.defineFlow({
    name: 'findHashtagsFlow',
    inputSchema: FindHashtagsInputSchema,
    outputSchema: FindHashtagsOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
//# sourceMappingURL=find-hashtags.js.map