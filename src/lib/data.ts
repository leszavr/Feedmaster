import type { Post, User } from './types';

export const mockUser: User = {
  name: 'Alexey',
  email: 'alexey@example.com',
  avatar: 'https://picsum.photos/seed/avatar/40/40',
};

const mockPosts: Post[] = [
    {
      id: 'post-1',
      title: 'Next.js 15 is here!',
      content: 'The latest version of Next.js comes with a lot of new features, including improved performance, better image optimization, and more. Check out the official blog post to learn all about it.',
      link: 'https://nextjs.org/blog',
      source: { name: 'Next.js Blog', type: 'RSS' },
      fetchedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: 'pending',
      keywords: ['nextjs', 'react', 'webdev'],
    },
    {
      id: 'post-2',
      title: 'The Future of AI in Web Development',
      content: 'Artificial intelligence is rapidly changing the landscape of web development. From AI-powered code assistants to automated testing, the possibilities are endless. This article explores the potential impact of AI on the industry.',
      link: 'https://example.com/ai-in-web-dev',
      source: { name: 'Tech Weekly', type: 'Web' },
      fetchedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'pending',
      keywords: ['ai', 'machine-learning', 'development'],
    },
    {
      id: 'post-3',
      title: 'A Deep Dive into Telegram Bots',
      content: 'Telegram bots can do more than just send messages. With the Bot API, you can create powerful applications that integrate with external services, process payments, and much more.',
      link: 'https://core.telegram.org/bots',
      source: { name: 'Telegram Docs', type: 'Telegram' },
      fetchedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'approved',
      keywords: ['telegram', 'bots', 'api'],
    },
    {
      id: 'post-4',
      title: 'Spammy McSpamface Article',
      content: 'This is a low-quality article with a lot of spammy keywords and clickbait. It should definitely be rejected.',
      link: 'https://spam.com/spam',
      source: { name: 'Spam Central', type: 'RSS' },
      fetchedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'rejected',
      keywords: ['spam', 'clickbait'],
    },
    {
      id: 'post-5',
      title: 'How to Build a Scalable Application with FastAPI',
      content: 'FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.',
      link: 'https://fastapi.tiangolo.com/',
      source: { name: 'FastAPI Docs', type: 'Web' },
      fetchedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      status: 'pending',
      keywords: ['fastapi', 'python', 'backend'],
    },
  ];

// Mock async function to get posts
export async function getPosts(): Promise<Post[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPosts;
}
