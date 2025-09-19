"use server";

import { summarizeContentForModeration } from "@/ai/flows/summarize-content-for-moderation";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const PostStatusSchema = z.enum(["approved", "rejected"]);

export async function getSummary(content: string): Promise<string> {
  // Adding a delay to simulate network latency for a better UX demo
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const result = await summarizeContentForModeration({ content });
    return result.summary;
  } catch (error) {
    console.error("Error summarizing content:", error);
    return "Failed to generate summary.";
  }
}

export async function updatePostStatus(
  postId: string,
  status: z.infer<typeof PostStatusSchema>
) {
  // In a real app, you'd update the database here.
  // For this MVP, we just log the action and revalidate the path.
  console.log(`Updating post ${postId} to status ${status}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  revalidatePath("/moderation");
  return { success: true, message: `Post ${status}` };
}
