'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestTimeToPost = getBestTimeToPost;
/**
 * @fileOverview An AI agent for recommending the best time to post on social media.
 *
 * - getBestTimeToPost - A function that returns the best time to post based on industry and platform.
 * - BestTimeToPostInput - The input type for the getBestTimeToPost function.
 * - BestTimeToPostOutput - The return type for the getBestTimeToPost function.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const BestTimeToPostInputSchema = genkit_2.z.object({
    industry: genkit_2.z.string().describe('The industry or topic of the content.'),
    platform: genkit_2.z
        .string()
        .describe('The social media platform (e.g., TikTok, Instagram).'),
});
const BestTimeToPostOutputSchema = genkit_2.z.object({
    time: genkit_2.z
        .string()
        .describe('The recommended posting time, including timezone (e.g., "9:00 AM EST").'),
    reasoning: genkit_2.z
        .string()
        .describe('A brief explanation for the recommendation (e.g., "Highest engagement on Tuesdays").'),
});
async function getBestTimeToPost(input) {
    return bestTimeToPostFlow(input);
}
const bestTimeToPostFlow = genkit_1.ai.defineFlow({
    name: 'bestTimeToPostFlow',
    inputSchema: BestTimeToPostInputSchema,
    outputSchema: BestTimeToPostOutputSchema,
}, async (input) => {
    const { output } = await genkit_1.ai.generate({
        prompt: `You are a social media expert. Based on the given industry and platform, determine the single best time to post for maximum engagement.
      Provide a specific time and a concise reason.

      Industry: ${input.industry}
      Platform: ${input.platform}
      `,
        output: {
            schema: BestTimeToPostOutputSchema,
        },
    });
    return output;
});
//# sourceMappingURL=best-time-to-post.js.map