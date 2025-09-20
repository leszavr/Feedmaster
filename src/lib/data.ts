import type { Post, User, Source } from './types';

export const mockUser: User = {
  name: 'Алексей',
  email: 'alexey@example.com',
  avatar: 'https://picsum.photos/seed/avatar/40/40',
};

const mockPosts: Post[] = [
    {
      id: 'post-1',
      title: 'Вышел Next.js 15!',
      content: 'Последняя версия Next.js содержит множество новых функций, включая улучшенную производительность, оптимизацию изображений и многое другое. Ознакомьтесь с официальным сообщением в блоге, чтобы узнать все подробности.',
      link: 'https://nextjs.org/blog',
      source: { name: 'Блог Next.js', type: 'RSS' },
      fetchedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 минут назад
      status: 'pending',
      keywords: ['nextjs', 'react', 'webdev'],
    },
    {
      id: 'post-2',
      title: 'Будущее ИИ в веб-разработке',
      content: 'Искусственный интеллект быстро меняет ландшафт веб-разработки. От ИИ-ассистентов по кодированию до автоматизированного тестирования — возможности безграничны. В этой статье рассматривается потенциальное влияние ИИ на отрасль.',
      link: 'https://example.com/ai-in-web-dev',
      source: { name: 'Tech Weekly', type: 'Web' },
      fetchedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 минут назад
      status: 'pending',
      keywords: ['ии', 'машинное-обучение', 'разработка'],
    },
    {
      id: 'post-3',
      title: 'Глубокое погружение в ботов Telegram',
      content: 'Боты Telegram могут делать больше, чем просто отправлять сообщения. С помощью Bot API вы можете создавать мощные приложения, которые интегрируются с внешними сервисами, обрабатывают платежи и многое другое.',
      link: 'https://core.telegram.org/bots',
      source: { name: 'Документация Telegram', type: 'Telegram' },
      fetchedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
      status: 'approved',
      keywords: ['telegram', 'bots', 'api'],
    },
    {
      id: 'post-4',
      title: 'Статья от Спамми МакСпамфейса',
      content: 'Это низкокачественная статья с большим количеством спам-ключевых слов и кликбейта. Ее определенно следует отклонить.',
      link: 'https://spam.com/spam',
      source: { name: 'Spam Central', type: 'RSS' },
      fetchedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 минут назад
      status: 'rejected',
      keywords: ['спам', 'кликбейт'],
    },
    {
      id: 'post-5',
      title: 'Как создать масштабируемое приложение с помощью FastAPI',
      content: 'FastAPI — это современный, быстрый (высокопроизводительный) веб-фреймворк для создания API на Python 3.7+ на основе стандартных подсказок типов Python.',
      link: 'https://fastapi.tiangolo.com/',
      source: { name: 'Документация FastAPI', type: 'Web' },
      fetchedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 час назад
      status: 'pending',
      keywords: ['fastapi', 'python', 'backend'],
    },
  ];

const mockSources: Source[] = [
  {
    id: 'source-1',
    name: 'Habr',
    type: 'RSS',
    url: 'https://habr.com/ru/rss/hubs/all/',
    keywords: 'ai, next.js, react',
    status: 'active',
    lastRun: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
  {
    id: 'source-2',
    name: 'Next.js Blog',
    type: 'RSS',
    url: 'https://nextjs.org/feed.xml',
    keywords: 'nextjs, release',
    status: 'active',
    lastRun: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: 'source-3',
    name: 'Pavel Durov',
    type: 'Telegram',
    url: 'https://t.me/s/durov',
    keywords: 'telegram, feature',
    status: 'paused',
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];


// Mock async function to get posts
export async function getPosts(): Promise<Post[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPosts;
}

// Mock async function to get sources
export async function getSources(): Promise<Source[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSources;
}
