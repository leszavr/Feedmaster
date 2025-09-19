import type { Bot, Post, Source, User } from "@/lib/types";

export const mockUser: User = {
  name: "Alexey",
  email: "alexey@example.com",
  avatar: "https://picsum.photos/seed/avatar/40/40",
};

export const mockBots: Bot[] = [
  { id: "bot-1", name: "Main Content Bot", token: "123456:ABC-DEF1234ghIkl-zyx57W2v1uT", channelId: "@main_content_channel", status: "active" },
  { id: "bot-2", name: "Tech News Bot", token: "789012:GHI-JKL7890mnOpq-rst34X5Y6z7", channelId: "@tech_news_updates", status: "inactive" },
  { id: "bot-3", name: "Marketing Bot", token: "345678:MNO-PQR3456stUvw-xyz90A1B2c", channelId: "@marketing_insights", status: "error" },
];

export const mockSources: Source[] = [
    { id: "src-1", name: "TechCrunch RSS", type: "RSS", url: "https://techcrunch.com/feed/", keywords: "AI, startup, funding", status: "active", lastRun: new Date(Date.now() - 5 * 60 * 1000) },
    { id: "src-2", name: "NextJS Blog", type: "Web", url: "https://nextjs.org/blog", keywords: "nextjs, react, vercel", status: "active", lastRun: new Date(Date.now() - 15 * 60 * 1000) },
    { id: "src-3", name: "OpenAI Telegram", type: "Telegram", url: "https://t.me/s/openai", keywords: "gpt, dall-e, sora", status: "paused", lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: "src-4", name: "Hacker News", type: "RSS", url: "https://news.ycombinator.com/rss", keywords: "programming, security, webdev", status: "active", lastRun: new Date(Date.now() - 30 * 60 * 1000) },
];

export const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "Introducing the Next-Gen AI Assistant for Developers",
    content: "Today, we're thrilled to announce a groundbreaking AI assistant designed to supercharge developer productivity. This new tool integrates seamlessly with your IDE, providing intelligent code completions, real-time bug detection, and automated documentation generation. It's built on a proprietary large language model trained on trillions of lines of code...",
    link: "https://example.com/post/1",
    source: { name: "TechCrunch RSS", type: "RSS" },
    fetchedAt: new Date(Date.now() - 10 * 60 * 1000),
    status: "pending",
    keywords: ["AI", "developer tool"],
  },
  {
    id: "post-2",
    title: "Vercel Ship 2024: Key Announcements for Next.js Developers",
    content: "Vercel's annual conference, Ship 2024, brought a wave of exciting updates for the Next.js ecosystem. The keynote highlighted the new Turbopack features, which now promise up to 700x faster updates in local development. Additionally, Server Actions have been stabilized and are ready for production use, simplifying data mutations and form handling...",
    link: "https://example.com/post/2",
    source: { name: "NextJS Blog", type: "Web" },
    fetchedAt: new Date(Date.now() - 45 * 60 * 1000),
    status: "pending",
    keywords: ["nextjs", "vercel", "turbopack"],
  },
  {
    id: "post-3",
    title: "The Ethics of Advanced AI: A Deep Dive",
    content: "As artificial intelligence becomes more capable, the ethical considerations surrounding its development and deployment grow more complex. This article explores the challenges of bias in training data, the potential for autonomous systems to make critical decisions, and the societal impact of mass automation. We discuss the need for robust regulatory frameworks and a multi-stakeholder approach to AI governance...",
    link: "https://example.com/post/3",
    source: { name: "AI Ethics Weekly", type: "RSS" },
    fetchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "pending",
    keywords: ["AI", "ethics", "governance"],
  },
];
