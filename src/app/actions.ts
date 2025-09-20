'use server';

import { revalidatePath } from 'next/cache';

// Mock function to simulate AI summary generation
export async function getSummary(content: string): Promise<string> {
  // In a real app, this would call a Genkit flow
  await new Promise(resolve => setTimeout(resolve, 1500));
  // This response would be in the user's locale, but for mock, we'll keep it simple.
  return `Это краткое содержание, сгенерированное ИИ: "${content.substring(0, 50)}...". В нем освещаются ключевые моменты и основные идеи, представленные в исходном тексте.`;
}

// Mock function to update post status
export async function updatePostStatus(postId: string, status: 'approved' | 'rejected'): Promise<{ success: boolean, message: string }> {
  console.log(`Updating post ${postId} to ${status}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would update the data source here.
  
  revalidatePath('/moderation');
  
  const message = status === 'approved' ? 'Пост был одобрен.' : 'Пост был отклонен.';
  
  return { success: true, message };
}
