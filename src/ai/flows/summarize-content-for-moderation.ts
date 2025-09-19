'use server';
/**
 * @fileOverview A content summarization AI agent for moderation.
 *
 * - summarizeContentForModeration - A function that handles the content summarization process.
 * - SummarizeContentForModerationInput - The input type for the summarizeContentForModeration function.
 * - SummarizeContentForModerationOutput - The return type for the summarizeContentForModeration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentForModerationInputSchema = z.object({
  content: z
    .string()
    .describe('The content to be summarized, can be a long article.'),
});
export type SummarizeContentForModerationInput = z.infer<typeof SummarizeContentForModerationInputSchema>;

const SummarizeContentForModerationOutputSchema = z.object({
  summary: z.string().describe('The summarized content.'),
});
export type SummarizeContentForModerationOutput = z.infer<typeof SummarizeContentForModerationOutputSchema>;

export async function summarizeContentForModeration(input: SummarizeContentForModerationInput): Promise<SummarizeContentForModerationOutput> {
  return summarizeContentForModerationFlow(input);
}

const summarizeContentForModerationPrompt = ai.definePrompt({
  name: 'summarizeContentForModerationPrompt',
  input: {schema: SummarizeContentForModerationInputSchema},
  output: {schema: SummarizeContentForModerationOutputSchema},
  prompt: `You are an expert content summarizer for article moderation purposes.

  You will be given a long article and you will summarize it so a moderator can quickly understand it and make a decision faster.

  Article: {{{content}}}`,
});

const summarizeContentForModerationFlow = ai.defineFlow(
  {
    name: 'summarizeContentForModerationFlow',
    inputSchema: SummarizeContentForModerationInputSchema,
    outputSchema: SummarizeContentForModerationOutputSchema,
  },
  async input => {
    const {output} = await summarizeContentForModerationPrompt(input);
    return output!;
  }
);
