'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCaptions = generateCaptions;
/**
 * @fileOverview An AI agent for generating social media captions.
 *
 * - generateCaptions - A function that generates captions for a given topic and tone.
 * - GenerateCaptionsInput - The input type for the generateCaptions function.
 * - GenerateCaptionsOutput - The return type for the generateCaptions function.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const GenerateCaptionsInputSchema = genkit_2.z.object({
    topic: genkit_2.z.string().describe('The topic or idea for the captions.'),
    tone: genkit_2.z.string().describe("The desired tone for the captions (e.g., 'Professional', 'Casual', 'Witty')."),
});
const GenerateCaptionsOutputSchema = genkit_2.z.object({
    captions: genkit_2.z.array(genkit_2.z.string()).describe('A list of 5 generated captions.'),
});
async function generateCaptions(input) {
    return generateCaptionsFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: 'generateCaptionsPrompt',
    input: { schema: GenerateCaptionsInputSchema },
    output: { schema: GenerateCaptionsOutputSchema },
    prompt: `You are a social media copywriter. Generate 5 engaging captions for the given topic and tone.

Topic: {{{topic}}}
Tone: {{{tone}}}

Captions:`,
});
const generateCaptionsFlow = genkit_1.ai.defineFlow({
    name: 'generateCaptionsFlow',
    inputSchema: GenerateCaptionsInputSchema,
    outputSchema: GenerateCaptionsOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
//# sourceMappingURL=generate-captions.js.map