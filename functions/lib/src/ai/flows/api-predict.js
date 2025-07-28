'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiPredict = apiPredict;
/**
 * @fileOverview An AI agent for predicting viral potential for the API.
 *
 * - apiPredict - A function that predicts trend potential.
 * - ApiPredictInput - The input type for the apiPredict function.
 * - ApiPredictOutput - The return type for the apiPredict function.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const ApiPredictInputSchema = genkit_2.z.object({
    topic: genkit_2.z.string().describe('The topic or trend to analyze.'),
});
const ApiPredictOutputSchema = genkit_2.z.object({
    confidenceScore: genkit_2.z.number().min(0).max(100).describe('A score from 0-100 representing the viral potential.'),
    keyDrivers: genkit_2.z.array(genkit_2.z.string()).describe('A list of key factors driving the prediction.'),
    recommendedAction: genkit_2.z.string().describe('A suggested action to capitalize on the trend.'),
});
async function apiPredict(input) {
    return apiPredictFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: 'apiPredictPrompt',
    input: { schema: ApiPredictInputSchema },
    output: { schema: ApiPredictOutputSchema },
    prompt: `Predict the viral potential of "[{{topic}}]" over the next 48 hours. Consider historical trends, engagement velocity, and platform algorithms. Respond in JSON format.`,
});
const apiPredictFlow = genkit_1.ai.defineFlow({
    name: 'apiPredictFlow',
    inputSchema: ApiPredictInputSchema,
    outputSchema: ApiPredictOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
//# sourceMappingURL=api-predict.js.map