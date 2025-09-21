
import type { Post, User, Source, Bot, AuditLog } from './types';

// This is the user that will be logged in by default.
// In a real app, this would come from an auth provider.
export const mockUser: User = {
  id: 'user-1',
  name: 'Алексей',
  email: 'alexey@example.com',
  avatar: 'https://picsum.photos/seed/avatar-1/40/40',
  role: 'admin',
  status: 'Active',
};

const mockUsers: User[] = [
  mockUser,
  {
    id: 'user-2',
    name: 'Мария',
    email: 'maria@example.com',
    avatar: 'https://picsum.photos/seed/avatar-2/40/40',
    role: 'moderator',
    status: 'Active',
  },
  {
    id: 'user-3',
    name: 'Иван',
    email: 'ivan@example.com',
    avatar: 'https://picsum.photos/seed/avatar-3/40/40',
    role: 'admin',
    status: 'Active',
  },
]

const mockBots: Bot[] = [
    {
      id: 'bot-1',
      name: 'Marketing Bot',
      token: '123456:ABC-DEF1234ghIkl-zyx57W2v1uT',
      channelId: '@my_marketing_channel',
      status: 'active',
      lastScan: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: 'bot-2',
      name: 'News Bot',
      token: '654321:ZYX-WVU6543srQpo-jih98fedCBA',
      channelId: '@daily_news_feed',
      status: 'inactive',
      lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 'bot-3',
      name: 'Dev Alerts Bot',
      token: '789012:GHI-JKL7890mnOpq-rst12uvwXYZ',
      channelId: '-1001234567890',
      status: 'error',
      lastScan: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    },
  ];

const mockSources: Source[] = [
  {
    id: 'source-1',
    name: 'Habr',
    type: 'RSS',
    url: 'https://habr.com/ru/rss/hubs/all/',
    botId: 'bot-2',
    keywords: 'ai, next.js, react',
    status: 'active',
    lastRun: new Date(Date.now() - 10 * 60 * 1000),
    blacklist: '',
    fetchInterval: 5,
    filterLogic: 'OR',
  },
  {
    id: 'source-2',
    name: 'Next.js Blog',
    type: 'RSS',
    url: 'https://nextjs.org/feed.xml',
    botId: 'bot-2',
    keywords: 'nextjs, release',
    status: 'active',
    lastRun: new Date(Date.now() - 30 * 60 * 1000),
    blacklist: '',
    fetchInterval: 15,
    filterLogic: 'OR',
  },
  {
    id: 'source-3',
    name: 'Pavel Durov',
    type: 'Telegram',
    url: 'https://t.me/s/durov',
    botId: 'bot-1',
    keywords: 'telegram, feature',
    status: 'paused',
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    blacklist: '',
    fetchInterval: 60,
    filterLogic: 'OR',
  },
];


const mockPosts: Post[] = [
    {
      id: 'post-1',
      title: 'Вышел Next.js 15!',
      content: 'Последняя версия Next.js содержит множество новых функций, включая улучшенную производительность, оптимизацию изображений и многое другое. Ознакомьтесь с официальным сообщением в блоге, чтобы узнать все подробности.',
      link: 'https://nextjs.org/blog',
      source: { id: 'source-2', name: 'Next.js Blog', type: 'RSS' },
      fetchedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 минут назад
      status: 'pending',
      keywords: ['nextjs', 'react', 'webdev'],
    },
    {
      id: 'post-2',
      title: 'Будущее ИИ в веб-разработке',
      content: 'Искусственный интеллект быстро меняет ландшафт веб-разработки. От ИИ-ассистентов по кодированию до автоматизированного тестирования — возможности безграничны. В этой статье рассматривается потенциальное влияние ИИ на отрасль.',
      link: 'https://example.com/ai-in-web-dev',
      source: { id: 'source-1', name: 'Habr', type: 'Web' },
      fetchedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 минут назад
      status: 'pending',
      keywords: ['ии', 'машинное-обучение', 'разработка'],
    },
    {
      id: 'post-3',
      title: 'Глубокое погружение в ботов Telegram',
      content: 'Боты Telegram могут делать больше, чем просто отправлять сообщения. С помощью Bot API вы можете создавать мощные приложения, которые интегрируются с внешними сервисами, обрабатывают платежи и многое другое.',
      link: 'https://core.telegram.org/bots',
      source: { id: 'source-3', name: 'Pavel Durov', type: 'Telegram' },
      fetchedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
      status: 'approved',
      keywords: ['telegram', 'bots', 'api'],
    },
    {
      id: 'post-4',
      title: 'Статья от Спамми МакСпамфейса',
      content: 'Это низкокачественная статья с большим количеством спам-ключевых слов и кликбейта. Ее определенно следует отклонить.',
      link: 'https://spam.com/spam',
      source: { id: 'source-1', name: 'Spam Central', type: 'RSS' },
      fetchedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 минут назад
      status: 'rejected',
      keywords: ['спам', 'кликбейт'],
    },
    {
      id: 'post-5',
      title: 'Как создать масштабируемое приложение с помощью FastAPI',
      content: 'FastAPI — это современный, быстрый (высокопроизводительный) веб-фреймворк для создания API на Python 3.7+ на основе стандартных подсказок типов Python.',
      link: 'https://fastapi.tiangolo.com/',
      source: { id: 'source-1', name: 'Habr', type: 'Web' },
      fetchedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 час назад
      status: 'pending',
      keywords: ['fastapi', 'python', 'backend'],
    },
  ];

export const mockAuditLogs: AuditLog[] = [
    { id: 1, user: 'Алексей', action: 'Создал бота', bot: 'Marketing Bot', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, user: 'Мария', action: 'Одобрила пост "Вышел Next.js 15!"', bot: 'News Bot', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
    { id: 3, user: 'System', action: 'Использован API ключ "Default Key"', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 4, user: 'Иван', action: 'Удалил источник "Old Blog"', bot: 'News Bot', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 5, user: 'Алексей', action: 'Приостановил пользователя "spam.user@example.com"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
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
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockSources;
}

// Mock async function to get bots
export async function getBots(): Promise<Bot[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockBots;
}

// Mock async function to get users
export async function getUsers(): Promise<User[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockUsers;
}
